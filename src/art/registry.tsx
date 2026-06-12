import type { FC } from 'react'
import './art.css'
import { Beans } from './items/Beans'
import { EspressoMachine } from './items/EspressoMachine'
import { MokaPot } from './items/MokaPot'
import { V60 } from './items/V60'
import { Kettle } from './items/Kettle'
import { MilkPitcher } from './items/MilkPitcher'
import { Grinder } from './items/Grinder'
import { Cup } from './items/Cup'
import { BeanBag } from './items/BeanBag'

export type ArtId =
  | 'beans'
  | 'espresso-machine'
  | 'moka-pot'
  | 'v60'
  | 'kettle'
  | 'milk-pitcher'
  | 'grinder'
  | 'cup'
  | 'bean-bag'

export interface ArtProps {
  className?: string
}

/**
 * THE swap point for your own artwork.
 * Replace any entry with a component that renders your scanned drawing
 * (e.g. `({className}) => <img className={className} src="/art/my-kettle.png" alt="" />`)
 * and every scene — playground, popups, shelf — picks it up.
 */
export const ART: Record<ArtId, FC<ArtProps>> = {
  beans: Beans,
  'espresso-machine': EspressoMachine,
  'moka-pot': MokaPot,
  v60: V60,
  kettle: Kettle,
  'milk-pitcher': MilkPitcher,
  grinder: Grinder,
  cup: Cup,
  'bean-bag': BeanBag,
}
