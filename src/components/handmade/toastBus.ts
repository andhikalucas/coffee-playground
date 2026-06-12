/** Tiny event bus so anything can raise a torn-paper notice. */

type ToastEmitter = (msg: string) => void

let emitter: ToastEmitter | null = null

export function setToastEmitter(fn: ToastEmitter | null) {
  emitter = fn
}

export function showToast(msg: string) {
  emitter?.(msg)
}
