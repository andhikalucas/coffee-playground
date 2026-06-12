import { hashString } from '../../lib/rng'

/**
 * Pre-authored jagged cut-out silhouettes for Persona panels.
 * Hand-tuned percentage polygons — never generated at runtime, never
 * animated; a popup picks one by hashing its key so different popups
 * get different cuts but each popup always keeps its own.
 */
export const JAGS: string[] = [
  'polygon(2% 9%, 13% 2%, 37% 6%, 55% 0%, 79% 5%, 97% 1%, 100% 27%, 96% 52%, 100% 79%, 88% 97%, 63% 92%, 45% 100%, 21% 94%, 4% 99%, 0% 68%, 3% 35%)',
  'polygon(0% 14%, 9% 3%, 28% 7%, 46% 1%, 68% 6%, 88% 0%, 99% 8%, 95% 33%, 100% 58%, 94% 82%, 99% 96%, 72% 99%, 52% 93%, 30% 100%, 8% 95%, 2% 71%, 5% 42%)',
  'polygon(4% 6%, 22% 0%, 41% 8%, 63% 2%, 82% 7%, 100% 3%, 96% 24%, 100% 47%, 95% 70%, 100% 92%, 79% 98%, 58% 91%, 38% 99%, 15% 93%, 0% 99%, 4% 66%, 0% 31%)',
  'polygon(1% 5%, 19% 2%, 39% 0%, 58% 7%, 81% 1%, 98% 6%, 94% 28%, 99% 51%, 93% 74%, 98% 98%, 76% 93%, 55% 99%, 33% 92%, 12% 98%, 3% 88%, 0% 55%, 5% 27%)',
  'polygon(3% 12%, 16% 4%, 35% 9%, 57% 3%, 76% 8%, 95% 2%, 99% 19%, 94% 41%, 99% 63%, 95% 88%, 99% 99%, 70% 94%, 49% 100%, 26% 95%, 6% 100%, 0% 77%, 4% 45%)',
]

export function jagFor(key: string): string {
  return JAGS[hashString(key) % JAGS.length]
}
