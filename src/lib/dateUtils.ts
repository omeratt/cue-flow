/**
 * Date formatting utilities
 * Extracted from RivalryCard as part of GH-019
 */

/**
 * Format a date string to a human-readable relative format
 * Examples: "Today", "Yesterday", "3 days ago", "2 weeks ago", "Mar 15, 2025"
 */
export function formatLastPlayed(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}
