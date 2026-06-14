import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RadioDoodle } from '../../art/items/RadioDoodle'
import { WobblyFrame } from '../handmade/WobblyFrame'
import { WobblyButton } from '../handmade/WobblyButton'
import { useSfx } from '../../audio/useSfx'
import { loadYouTubeApi } from '../../audio/youtubeAudio'
import type { YTPlayer } from '../../audio/youtubeAudio'

const SONG = 'beneath the mask'

interface Track {
  id: string // youtube video id
  tag: string
}

const TRACKS: Track[] = [
  { id: 'woz5qvDdMRM', tag: 'original' },
  { id: 'w7Cm74nDhac', tag: 'instrumental' },
  { id: 'U2Qd9TRY1Ro', tag: 'rain' },
  { id: 'mEpsyvKCV3k', tag: 'rain · instrumental' },
]

// the spinning record image
const RECORD_THUMB = '/thumbnail.jpg'

/**
 * Drives a hidden YouTube player as an audio source: pick a track (autoplays),
 * play/pause, and loop a single track forever. The player element is created
 * imperatively inside `wrapperRef` so React never tries to reconcile the node
 * the IFrame API swaps out for its <iframe>.
 */
function useRadioPlayer(wrapperRef: RefObject<HTMLDivElement | null>) {
  const playerRef = useRef<YTPlayer | null>(null)
  const volumeRef = useRef(100)
  const [playing, setPlaying] = useState(false)

  const select = useCallback(
    async (videoId: string) => {
      setPlaying(true) // optimistic: the record starts turning the moment you pick,
      // independent of how quickly YouTube's onReady/onStateChange events arrive
      const YT = await loadYouTubeApi()
      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId) // autoplays the new track
        return
      }
      const wrapper = wrapperRef.current
      if (!wrapper) return
      const target = document.createElement('div')
      wrapper.appendChild(target)
      playerRef.current = new YT.Player(target, {
        videoId,
        width: 320,
        height: 180,
        playerVars: { autoplay: 1, controls: 0, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e) => {
            e.target.setVolume(volumeRef.current)
            e.target.playVideo()
            setPlaying(true)
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(0) // single-track loop
              e.target.playVideo()
              return
            }
            if (e.data === YT.PlayerState.PLAYING) setPlaying(true)
            else if (e.data === YT.PlayerState.PAUSED) setPlaying(false)
          },
        },
      })
    },
    [wrapperRef],
  )

  const toggle = useCallback(() => {
    const p = playerRef.current
    if (!p) return
    if (playing) {
      p.pauseVideo()
      setPlaying(false)
    } else {
      p.playVideo()
      setPlaying(true)
    }
  }, [playing])

  const setVolume = useCallback((v: number) => {
    volumeRef.current = v
    playerRef.current?.setVolume(v)
  }, [])

  // never leave a detached player running
  useEffect(() => () => playerRef.current?.destroy(), [])

  return { playing, select, toggle, setVolume }
}

/**
 * The café radio, bottom-right. Click to expand the track picker; pick one and
 * the panel grows into a spinning-record "now playing". Audio comes from an
 * invisible YouTube player so it behaves like a music player, not a video embed.
 */
export function RadioPanel() {
  const playSfx = useSfx()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Track | null>(null)
  const [volume, setVolume] = useState(0.6)
  const [thumbFailed, setThumbFailed] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const radio = useRadioPlayer(wrapperRef)

  const pick = (t: Track) => {
    // WobblyButton plays its own click sound
    setThumbFailed(false)
    setSelected(t)
    void radio.select(t.id)
  }

  const onVolume = (v: number) => {
    setVolume(v)
    radio.setVolume(Math.round(v * 100))
  }

  return (
    <div className="fixed z-65" style={{ right: 20, bottom: 20 }}>
      {/* invisible audio engine — a real YouTube player, kept transparent + parked
          bottom-left so the browser keeps it alive; driven via the IFrame API */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 -z-10 h-[180px] w-[320px] opacity-0"
        aria-hidden="true"
      >
        <div ref={wrapperRef} />
      </div>

      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="collapsed"
            type="button"
            className="relative grid h-14 w-16 place-items-center border-[2.5px] border-solid border-ink bg-paper-deep shadow-ink-sm blob-a"
            style={{ rotate: 2 }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            whileHover={{ scale: 1.08, rotate: -1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 480, damping: 20 }}
            onClick={() => {
              playSfx('click')
              setOpen(true)
              void loadYouTubeApi() // warm it up so the first track plays within the gesture
            }}
            aria-label="open the café radio"
            title="café radio"
          >
            <RadioDoodle />
            {radio.playing && (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 animate-pulse rounded-full bg-red ring-2 ring-paper-deep" />
            )}
          </motion.button>
        ) : (
          <motion.div
            key="open"
            // when the washi nav is at the bottom (≤1024px) the panel lifts to float
            // above the corner controls (mute, scene-nav bar) so nothing overlaps,
            // keeping its natural width anchored bottom-right rather than going full-width
            className="max-[1024px]:fixed max-[1024px]:bottom-20 max-[1024px]:right-5"
            initial={{ y: 30, scale: 0.85, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
          >
            <WobblyFrame
              seed="radio-panel"
              fill="var(--paper-deep)"
              padding={18}
              className="w-[min(86vw,360px)]"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-script text-[1.4rem] font-bold text-ink">café radio</span>
                <WobblyButton
                  seed="radio-close"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  aria-label="close the radio"
                >
                  ✕
                </WobblyButton>
              </div>

              {selected && (
                <>
                  <div className="mb-3 flex items-center gap-4">
                    {/* the record spins without changing the shadow*/}
                    <div
                      className="relative h-28 w-28 shrink-0"
                      style={{ filter: 'drop-shadow(4px 2px 0 var(--color-red))' }}
                    >
                      <div
                        data-testid="record-disc"
                        className="absolute inset-0 animate-[spin_8s_linear_infinite] overflow-hidden rounded-full bg-ink"
                        style={{ animationPlayState: radio.playing ? 'running' : 'paused' }}
                      >
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              'repeating-radial-gradient(circle at 50% 50%, #14100a 0 1px, #2a1b10 1px 3.5px)',
                          }}
                        />
                        {thumbFailed ? (
                          <div className="absolute left-1/2 top-1/2 grid h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-caramel text-[1.4rem] text-ink">
                            ♪
                          </div>
                        ) : (
                          <img
                            src={RECORD_THUMB}
                            alt=""
                            className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover"
                            onError={() => setThumbFailed(true)}
                          />
                        )}
                      </div>
                      <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper-deep ring-2 ring-ink" />
                    </div>

                    {/* two fonts only, both already used in this panel: hand for the
                        small label (like "switch track"), script for the title */}
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="font-hand text-[0.82rem] text-ink-faint">now playing</span>
                      <span className="truncate font-script text-[1.65rem] font-bold leading-none text-ink">
                        {SONG}
                      </span>
                      <span className="font-script text-[1.15rem] leading-tight text-ink-soft">
                        — {selected.tag}
                      </span>
                      <div className="mt-2">
                        <WobblyButton
                          seed="radio-toggle"
                          variant={radio.playing ? 'ink' : 'red'}
                          onClick={radio.toggle}
                        >
                          {radio.playing ? '❚❚ pause' : '▶ play'}
                        </WobblyButton>
                      </div>
                    </div>
                  </div>

                  <input
                    className="coffee-range mb-3"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => onVolume(Number(e.target.value))}
                    aria-label="music volume"
                  />
                </>
              )}

              <div className="mb-2 h-px w-full bg-ink/15" />
              <span className="mb-1.5 block font-hand text-[0.85rem] text-ink-soft">
                {selected ? 'switch track' : 'pick a track'}
              </span>
              <div className="flex flex-col gap-1.5">
                {TRACKS.map((t) => (
                  <WobblyButton
                    key={t.id}
                    seed={`track-${t.id}`}
                    variant={selected?.id === t.id ? 'ink' : 'paper'}
                    onClick={() => pick(t)}
                    aria-pressed={selected?.id === t.id}
                  >
                    {t.tag}
                  </WobblyButton>
                ))}
              </div>
            </WobblyFrame>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
