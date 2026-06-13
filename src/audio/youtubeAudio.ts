/**
 * Thin, typed loader for the YouTube IFrame Player API. We use a real YouTube
 * player (kept invisible) purely as an audio engine so the radio behaves like a
 * music player rather than an embedded video. Only the surface we actually call
 * is typed here.
 */

export interface YTPlayer {
  playVideo(): void
  pauseVideo(): void
  loadVideoById(videoId: string): void
  seekTo(seconds: number, allowSeekAhead?: boolean): void
  setVolume(volume: number): void
  destroy(): void
}

interface YTPlayerEvent {
  target: YTPlayer
  data: number
}

interface YTPlayerOptions {
  videoId?: string
  width?: string | number
  height?: string | number
  playerVars?: Record<string, string | number>
  events?: {
    onReady?: (e: YTPlayerEvent) => void
    onStateChange?: (e: YTPlayerEvent) => void
    onError?: (e: YTPlayerEvent) => void
  }
}

interface YTNamespace {
  Player: new (el: HTMLElement, opts: YTPlayerOptions) => YTPlayer
  PlayerState: {
    UNSTARTED: number
    ENDED: number
    PLAYING: number
    PAUSED: number
    BUFFERING: number
    CUED: number
  }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<YTNamespace> | null = null

/** Load the IFrame API script once; resolves with the global `YT` namespace. */
export function loadYouTubeApi(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise
  apiPromise = new Promise<YTNamespace>((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT)
      return
    }
    // the API calls this global once it's parsed — chain any existing handler
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      if (window.YT) resolve(window.YT)
    }
    if (!document.getElementById('yt-iframe-api')) {
      const tag = document.createElement('script')
      tag.id = 'yt-iframe-api'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  })
  return apiPromise
}

export type { YTNamespace }
