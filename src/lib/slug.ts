/** Filename-safe slug from a title; empty / punctuation-only falls back to 'untitled-brew'. */
export const slug = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled-brew'
