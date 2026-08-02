/**
 * Merge classnames safely, removing falsy values.
 * Standard utility for conditional Tailwind classes.
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
