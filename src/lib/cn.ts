/** Join truthy class fragments into one className string — a tiny, no-dep clsx. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
