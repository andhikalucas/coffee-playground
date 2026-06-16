/**
 * Tiny bus so another scene (the cupboard's cross-link) can ask the board to
 * open a specific card. Mirrors toastBus' module-bus idiom. Because the gallery
 * mounts mid scene-transition, a request made before it subscribes is held in
 * `pending` and fired the moment the listener registers.
 */
type FocusListener = (id: string) => void

let listener: FocusListener | null = null
let pending: string | null = null

export function setBoardFocusListener(fn: FocusListener | null) {
  listener = fn
  if (fn && pending) {
    const id = pending
    pending = null
    fn(id)
  }
}

export function requestBoardFocus(id: string) {
  if (listener) listener(id)
  else pending = id
}
