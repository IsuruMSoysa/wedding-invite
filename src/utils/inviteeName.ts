/**
 * Converts a URL path slug (e.g. "mr-tom-hanks") into a display name ("Mr. Tom Hanks").
 * Used for personalized invite links like BASEURL/mr-tom-hanks
 */

const HONORIFIC_MAP: Record<string, string> = {
  mr: "Mr.",
  mrs: "Mrs.",
  ms: "Ms.",
  dr: "Dr.",
  prof: "Prof.",
};

const DEFAULT_GUEST_LABEL = "Dear Guest";

function capitalizeWord(word: string): string {
  if (!word) return word;
  const lower = word.toLowerCase();
  if (HONORIFIC_MAP[lower]) return HONORIFIC_MAP[lower];
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Parses pathname (e.g. "/mr-tom-hanks") into a display name.
 * Empty path or "/" returns a generic label for non-personalized visits.
 */
export function parseInviteeName(pathname: string): string {
  const slug = pathname.replace(/^\/+|\/+$/g, "").trim();
  if (!slug) return DEFAULT_GUEST_LABEL;

  const parts = slug.split("-").filter(Boolean);
  if (parts.length === 0) return DEFAULT_GUEST_LABEL;

  return parts.map(capitalizeWord).join(" ");
}

/**
 * True when the URL has an invitee slug (not root only).
 */
export function hasInviteeSlug(pathname: string): boolean {
  const slug = pathname.replace(/^\/+|\/+$/g, "").trim();
  return slug.length > 0;
}
