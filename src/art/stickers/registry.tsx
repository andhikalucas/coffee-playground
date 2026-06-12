import type { FC } from 'react'
import type { StickerId } from '../../state/types'
import {
  HeartDoodle,
  StarDoodle,
  SteamDoodle,
  BeanSticker,
  RingStainSticker,
  SparkleDoodle,
  MugDoodle,
} from './doodles'

export interface StickerDef {
  label: string
  Component: FC<{ className?: string }>
  /** rendered footprint on the card, px at full card size */
  baseSize: number
}

/** Same deal as the art registry — swap any doodle for your own. */
export const STICKERS: Record<StickerId, StickerDef> = {
  heart: { label: 'heart', Component: HeartDoodle, baseSize: 52 },
  star: { label: 'star', Component: StarDoodle, baseSize: 54 },
  steam: { label: 'steam swirl', Component: SteamDoodle, baseSize: 56 },
  bean: { label: 'bean', Component: BeanSticker, baseSize: 48 },
  ring: { label: 'mug ring', Component: RingStainSticker, baseSize: 72 },
  sparkle: { label: 'sparkles', Component: SparkleDoodle, baseSize: 54 },
  mug: { label: 'lil mug', Component: MugDoodle, baseSize: 56 },
}

export const STICKER_IDS = Object.keys(STICKERS) as StickerId[]
