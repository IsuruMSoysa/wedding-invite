import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useAnimation,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Calendar,
  MapPin,
  Heart,
  Sparkles,
  Music,
  Pause,
  HeartCrack,
  Send,
} from "lucide-react";
import {
  WEDDING,
  getWeddingDateFormatted,
  getGoogleCalendarUrl,
  MAP_EMBED_SRC,
} from "./constants";
import { parseInviteeName, hasInviteeSlug } from "./utils/inviteeName";

// Main App Component
export default function App() {
  const inviteeName = parseInviteeName(window.location.pathname);
  const personalized = hasInviteeSlug(window.location.pathname);

  useEffect(() => {
    const baseTitle = `${WEDDING.names.first} & ${WEDDING.names.second} – Wedding`;
    document.title = personalized ? `${inviteeName} – ${baseTitle}` : baseTitle;
  }, [inviteeName, personalized]);

  return (
    <div className="bg-cream text-coffee font-sans min-h-screen overflow-x-hidden selection:bg-maroon/20">
      {/* <MusicToggle /> */}
      <div
        className="fixed inset-0 z-0 w-full max-w-none bg-center bg-no-repeat pointer-events-none opacity-5"
        style={{
          backgroundImage: "url(/images/paper-2.jpg)",
          backgroundSize: "cover",
        }}
        aria-hidden
      />
      <BackgroundElements />
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-6 md:px-12">
        <HeroSection inviteeName={inviteeName} personalized={personalized} />
        <DetailsSection />
        <GallerySection />
        <MapSection />
        <RsvpSection inviteeName={inviteeName} personalized={personalized} />
      </main>
      <footer className="py-6 text-center text-coffee/60 font-round text-sm">
        <p>
          © 2026 {WEDDING.names.first} & {WEDDING.names.second}
        </p>
      </footer>
    </div>
  );
}

// Animated Flying Butterfly Component
const FlyingButterfly = ({
  index = 0,
  size = 12,
  color = "#D4AF37",
  delay = 0,
  isForeground = false,
}: {
  index?: number;
  size?: number;
  color?: string;
  delay?: number;
  isForeground?: boolean;
}) => {
  const { scrollYProgress } = useScroll();

  // Generate a semi-random path based on index
  const getPath = (i: number) => {
    const seed = i * 13.37;
    const random = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const startsLeft = i % 2 === 0;
    // Spread starting x so butterflies don't all cluster at the same position
    const startX = startsLeft
      ? `${3 + random(seed + 12) * 35}%`
      : `${62 + random(seed + 12) * 35}%`;
    const xPoints = startsLeft
      ? [
          startX,
          `${10 + random(seed) * 30}%`,
          `${40 + random(seed + 1) * 40}%`,
          `${70 + random(seed + 2) * 30}%`,
          "90%",
        ]
      : [
          startX,
          `${90 - random(seed) * 30}%`,
          `${60 - random(seed + 1) * 40}%`,
          `${30 - random(seed + 2) * 30}%`,
          "10%",
        ];

    // More varied y points across the full height
    const yPoints = [
      `${5 + random(seed + 3) * 15}vh`,
      `${20 + random(seed + 4) * 30}vh`,
      `${50 + random(seed + 5) * 40}vh`,
      `${80 + random(seed + 6) * 15}vh`,
      `${40 + random(seed + 7) * 50}vh`,
    ];

    const rotatePoints = [
      startsLeft ? 30 : -20,
      random(seed + 8) * 90 - 45,
      random(seed + 9) * 120 - 60,
      random(seed + 10) * 90 - 45,
      startsLeft ? 45 : -45,
    ];

    return { x: xPoints, y: yPoints, rotate: rotatePoints };
  };

  const path = getPath(index);

  // Use left/top (not x/y translate): % in translate is relative to the element's
  // own size, so butterflies stayed on the left. left/top % is relative to viewport.
  const left = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], path.x);
  const top = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], path.y);
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    path.rotate,
  );

  return (
    <motion.div
      style={{ left, top, rotate }}
      className={`fixed ${isForeground ? "z-10000" : "z-0"} pointer-events-none -translate-x-1/2 -translate-y-1/2`}
    >
      <svg
        viewBox="0 0 100 100"
        style={{ width: `${size * 5}px`, height: `${size * 5}px` }}
      >
        <motion.g
          animate={{
            scaleX: [1, 0.3, 1],
          }}
          transition={{
            duration: 0.3 + Math.random() * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay,
          }}
          style={{ transformOrigin: "center" }}
        >
          {/* Butterfly wings */}
          <path
            d="M50 50 C20 20 10 40 10 60 C10 80 40 90 50 50 Z"
            fill={color}
            fillOpacity="0.8"
          />
          <path
            d="M50 50 C80 20 90 40 90 60 C90 80 60 90 50 50 Z"
            fill={color}
            fillOpacity="0.8"
          />
          {/* Body */}
          <ellipse cx="50" cy="55" rx="3" ry="15" fill="#6F4E37" />
          {/* Antennae */}
          <path
            d="M48 42 Q45 35 40 35"
            stroke="#6F4E37"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M52 42 Q55 35 60 35"
            stroke="#6F4E37"
            strokeWidth="1"
            fill="none"
          />
        </motion.g>
      </svg>
    </motion.div>
  );
};

// Background decorative elements
const BackgroundElements = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 ">
    <motion.div
      animate={{
        rotate: 360,
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-20 -right-20 w-96 h-96 bg-olive/5 rounded-full blur-3xl"
    />
    <motion.div
      animate={{
        rotate: -360,
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute -bottom-20 -left-20 w-[30rem] h-[30rem] bg-maroon/5 rounded-full blur-3xl"
    />
    {/* Background butterflies (behind content) */}
    <FlyingButterfly index={0} size={15} color="#556B2F" />
    <FlyingButterfly index={1} size={10} color="#D4AF37" delay={0.5} />

    {/* Foreground butterflies (on top of all elements) */}
    <FlyingButterfly
      index={2}
      size={18}
      color="#D4AF37"
      delay={1}
      isForeground
    />
    <FlyingButterfly
      index={3}
      size={12}
      color="#D4AF37"
      delay={1.5}
      isForeground
    />
    <FlyingButterfly
      index={4}
      size={14}
      color="#C5A028"
      delay={2}
      isForeground
    />
    <FlyingButterfly
      index={5}
      size={11}
      color="var(--color-olive)"
      delay={2.5}
      isForeground
    />
  </div>
);

// Animated Section Helper
const AnimatedSection = ({
  children,
  delay = 0.2,
  isZoomIn = false,
}: {
  children: ReactNode;
  delay?: number;
  isZoomIn?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={isZoomIn ? { opacity: 0, scale: 0.85 } : { opacity: 0, y: 50 }}
      animate={
        isInView
          ? isZoomIn
            ? { opacity: 1, scale: 1 }
            : { opacity: 1, y: 0 }
          : {}
      }
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

// Music Toggle Component
// const MusicToggle = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef<HTMLAudioElement>(null);

//   const togglePlay = () => {
//     if (!audioRef.current) return;
//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <>
//       <audio
//         ref={audioRef}
//         src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
//         loop
//       />
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={togglePlay}
//         className="fixed bottom-8 right-8 z-50 p-4 glass text-olive rounded-full shadow-lg border-gold/30"
//         aria-label={isPlaying ? "Pause music" : "Play music"}
//       >
//         {isPlaying ? <Pause size={24} /> : <Music size={24} />}
//       </motion.button>
//     </>
//   );
// };

// Hero Section Component
const HeroSection = ({
  inviteeName,
  personalized,
}: {
  inviteeName: string;
  personalized: boolean;
}) => {
  const greeting = personalized ? `Dear ${inviteeName},` : `Welcome,`;
  return (
    <>
      <header className="relative min-h-[80vh] flex flex-col items-center justify-center text-center py-12">
        {/* Botanical strip at top of hero – not fixed; scrolls with section; 1vh + cover */}
        <AnimatedSection delay={0.1}>
          <span className="font-handwritten text-3xl md:text-4xl text-maroon mb-6 block">
            {greeting}
          </span>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <img
            src="/images/ring.png"
            alt="Wedding Rings"
            className="w-24 md:w-24 mx-auto"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <h1 className="font-round text-5xl md:text-8xl text-olive font-bold leading-tight mb-4 tracking-tighter">
            {WEDDING.names.first} <span className="text-gold">&</span>{" "}
            {WEDDING.names.second}
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.5}>
          <div className="max-w-2xl mx-auto mb-12">
            <p className="font-round text-xl md:text-2xl text-coffee/80 leading-relaxed mb-4">
              {WEDDING.heroGreeting}
            </p>
            <p className="font-round text-lg text-olive/70 italic">
              {WEDDING.heroInvite}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.7}>
          <div className="glass p-8 rounded-3xl border-gold/20 max-w-lg mx-auto relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
            <p className="font-handwritten text-2xl text-maroon mb-2">
              "{WEDDING.nerudaQuote}"
            </p>
            <p className="font-round text-xs uppercase tracking-widest text-coffee/50">
              {WEDDING.nerudaRef}
            </p>
          </div>
        </AnimatedSection>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-bounce text-maroon"
        >
          <Heart size={40} fill="currentColor" className="opacity-40" />
        </motion.div>
        <AnimatedSection delay={0.9} isZoomIn={true}>
          <CountdownTimer />
        </AnimatedSection>
      </header>
    </>
  );
};

// Countdown Timer Component
const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date(WEDDING.weddingDateTime) - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-16 relative">
      <div className="flex justify-center gap-4 md:gap-10">
        {Object.entries(timeLeft).map(([interval, value], idx) => (
          <motion.div
            key={interval}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 + idx * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="glass w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-2xl border-gold/10 shadow-inner">
              <span className="font-round text-2xl md:text-4xl font-bold text-olive">
                {value.toString().padStart(2, "0")}
              </span>
            </div>
            <span className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-coffee/60 font-round font-bold">
              {interval}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Details Section Component
const DetailsSection = () => {
  return (
    <section className="py-16">
      <AnimatedSection>
        <h2 className="font-round text-3xl md:text-5xl text-center text-olive font-bold mb-16">
          {WEDDING.detailsTitle}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Calendar,
              title: getWeddingDateFormatted(),
              subtitle: "Save the Date",
              link: getGoogleCalendarUrl(),
              linkText: "Add to Calendar",
            },
            {
              icon: Sparkles,
              title: WEDDING.weddingTime,
              subtitle: "The Golden Hour",
              link: null,
            },
            {
              icon: MapPin,
              title: WEDDING.venueName,
              subtitle: WEDDING.venueAddress,
              link: "#map",
              linkText: "View Map",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="glass p-10 rounded-[3rem] text-center border-gold/10 flex flex-col items-center group"
            >
              <div className="mb-6 p-4 bg-olive/5 rounded-full text-maroon group-hover:bg-maroon group-hover:text-cream transition-colors duration-500">
                <item.icon size={32} />
              </div>
              <h3 className="font-round text-2xl text-coffee font-bold mb-2">
                {item.title}
              </h3>
              <p className="text-coffee/60 mb-6 font-round">{item.subtitle}</p>
              {item.link && (
                <a
                  href={item.link}
                  target={item.link.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-olive hover:text-maroon transition-colors uppercase tracking-widest border-b border-olive/20 pb-1"
                >
                  {item.linkText}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
};

// Gallery Section Component
const GallerySection = () => {
  const images = [
    "https://picsum.photos/seed/picsum1/800/600",
    "https://picsum.photos/seed/picsum2/600/800",
    "https://picsum.photos/seed/picsum3/800/600",
    "https://picsum.photos/seed/picsum4/600/800",
    "https://picsum.photos/seed/picsum5/800/600",
    "https://picsum.photos/seed/picsum6/600/800",
  ];

  return (
    <section className="py-16">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="font-round text-3xl md:text-5xl text-olive font-bold mb-4">
            {WEDDING.galleryTitle}
          </h2>
          <div className="w-24 h-1 bg-gold/30 mx-auto rounded-full" />
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-[2rem] shadow-2xl border-4 border-cream group"
            >
              <img
                src={src}
                alt={`Gallery image ${index + 1}`}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
};

// Map Section
const MapSection = () => {
  return (
    <section id="map" className="py-16">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="font-round text-3xl md:text-5xl text-olive font-bold mb-4">
            {WEDDING.mapTitle}
          </h2>
          <p className="font-round text-coffee/60 uppercase tracking-widest">
            {WEDDING.venueName}
          </p>
        </div>
        <div className="glass p-4 rounded-[3rem] border-gold/20 overflow-hidden shadow-2xl">
          <div className="rounded-[2.5rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
            <iframe
              src={MAP_EMBED_SRC}
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Venue location"
            />
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

type RsvpSubmitStatus = "idle" | "submitting" | "success" | "error";

const RSVP_SCRIPT_URL =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.GOOGLE_SHEETS_SCRIPT_URL) ||
  "";

// RSVP Section Component
const RsvpSection = ({
  inviteeName,
  personalized,
}: {
  inviteeName: string;
  personalized: boolean;
}) => {
  const [name, setName] = useState(personalized ? inviteeName : "");
  const [attendance, setAttendance] = useState<"" | "yes" | "no">("");
  const [submitStatus, setSubmitStatus] = useState<RsvpSubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!RSVP_SCRIPT_URL) {
      setSubmitStatus("error");
      setErrorMessage(
        "RSVP is not configured. Set GOOGLE_SHEETS_SCRIPT_URL in .env.",
      );
      return;
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      setSubmitStatus("error");
      setErrorMessage("Please enter your name.");
      return;
    }
    if (attendance !== "yes" && attendance !== "no") {
      setSubmitStatus("error");
      setErrorMessage("Please choose whether you can join us.");
      return;
    }

    setSubmitStatus("submitting");

    try {
      const body = new URLSearchParams({ name: trimmedName, attendance });
      const res = await fetch(RSVP_SCRIPT_URL, {
        method: "POST",
        body,
        redirect: "follow",
      });
      const text = await res.text();
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = JSON.parse(text) as { ok?: boolean; error?: string };
      } catch {
        if (!res.ok) throw new Error("Request failed");
      }

      if (data.ok === true) {
        setSubmitStatus("success");
        return;
      }
      if (data.ok === false && data.error) {
        setSubmitStatus("error");
        setErrorMessage(data.error);
        return;
      }
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
      setErrorMessage(
        "Could not send your RSVP. Please try again or contact us directly.",
      );
    }
  };

  return (
    <section className="py-12">
      <AnimatedSection>
        <div className="glass-dark px-6 py-12 md:p-20 rounded-[4rem] text-cream relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mr-32 -mt-32" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="font-round text-4xl md:text-6xl font-bold mb-6">
              {WEDDING.rsvpTitle}
            </h2>
            <p className="font-round text-lg text-cream/70 mb-6">
              {WEDDING.rsvpDeadlineText}{" "}
              <span className="text-gold font-bold">{WEDDING.rsvpByDate}</span>
            </p>

            <AnimatePresence mode="wait">
              {submitStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10"
                >
                  <div className="inline-flex p-6 bg-gold/20 rounded-full mb-6">
                    <Heart size={48} className="text-gold fill-gold" />
                  </div>
                  <h3 className="font-round text-3xl font-bold mb-4">
                    You're on the list!
                  </h3>
                  <p className="text-cream/60">
                    We can't wait to celebrate this cosmic union with you.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-8 text-left"
                >
                  {submitStatus === "error" && errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-maroon/20 border border-maroon/50 text-cream p-4 rounded-2xl text-sm"
                    >
                      {errorMessage}
                    </motion.p>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold uppercase tracking-widest text-gold/80 ml-4"
                    >
                      Your Name(s)
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={submitStatus === "submitting"}
                      className="w-full bg-cream/5 border-2 border-cream/10 rounded-3xl px-8 py-5 focus:border-gold/50 focus:outline-none transition-colors disabled:opacity-50"
                      placeholder="e.g. John & Jane"
                    />
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-bold uppercase tracking-widest text-gold/80 ml-4">
                      Will you join the dance?
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: "yes", label: "Joyfully Accept", icon: Heart },
                        {
                          id: "no",
                          label: "Regretfully Decline",
                          icon: HeartCrack,
                        },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setAttendance(opt.id as any)}
                          className={`flex items-center justify-between px-8 py-5 rounded-3xl border-2 transition-all ${
                            attendance === opt.id
                              ? "bg-gold text-coffee border-gold"
                              : "bg-cream/5 border-cream/10 hover:border-cream/30"
                          }`}
                        >
                          <span className="font-bold">{opt.label}</span>
                          <opt.icon
                            size={20}
                            className={
                              attendance === opt.id
                                ? "text-coffee"
                                : "text-gold"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitStatus === "submitting"}
                      className="w-full bg-gold text-coffee font-round font-bold py-6 rounded-3xl shadow-xl shadow-gold/10 hover:shadow-gold/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                    >
                      {submitStatus === "submitting" ? (
                        <div className="w-6 h-6 border-4 border-coffee/30 border-t-coffee rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send RSVP</span>
                          <Send size={20} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};
