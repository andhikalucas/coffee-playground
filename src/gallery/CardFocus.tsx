import { useState } from 'react'
import type { Recipe } from '../state/types'
import { PersonaPopup, PopupRow } from '../components/persona/PersonaPopup'
import { PersonaTitle } from '../components/persona/PersonaTitle'
import { WobblyButton } from '../components/handmade/WobblyButton'
import { showToast } from '../components/handmade/toastBus'
import { IndexCard } from '../recipe/IndexCard'
import { exportRecipePng } from '../lib/exportPng'
import { useRecipes } from '../state/RecipesContext'
import { useScene } from '../state/SceneContext'
import { useSfx } from '../audio/useSfx'
import styles from './gallery.module.css'

interface CardFocusProps {
  recipe: Recipe
  onClose: () => void
}

/** Full-size look at a pinned recipe, with the grown-up buttons. */
export function CardFocus({ recipe, onClose }: CardFocusProps) {
  const { editRecipe, deleteRecipe } = useRecipes()
  const { goTo } = useScene()
  const play = useSfx()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [exporting, setExporting] = useState(false)

  const onEdit = () => {
    editRecipe(recipe.id)
    onClose()
    goTo('maker')
  }

  const onExport = async () => {
    if (exporting) return
    setExporting(true)
    try {
      await exportRecipePng(recipe)
      play('ding')
      showToast('saved a png of your card ♡')
    } catch {
      showToast('hmm, the export spilled — try once more?')
    } finally {
      setExporting(false)
    }
  }

  const onDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      window.setTimeout(() => setConfirmDelete(false), 2600)
      return
    }
    play('swish')
    deleteRecipe(recipe.id)
    showToast('unpinned and recycled')
    onClose()
  }

  return (
    <PersonaPopup
      popupKey={`recipe-${recipe.id}`}
      onClose={onClose}
      width={780}
      labelledBy={`focus-${recipe.id}`}
    >
      <PopupRow>
        <div id={`focus-${recipe.id}`}>
          <PersonaTitle text={recipe.title || 'untitled brew'} size="md" seed={recipe.id} />
        </div>
      </PopupRow>
      <PopupRow>
        <div className={styles.focusCardWrap}>
          <IndexCard recipe={recipe} mode="static" />
        </div>
      </PopupRow>
      <PopupRow>
        <div className={styles.focusActions}>
          <WobblyButton seed="focus-export" variant="red" onClick={onExport} disabled={exporting}>
            {exporting ? 'brewing the png…' : '⤓ save as png'}
          </WobblyButton>
          <WobblyButton seed="focus-edit" variant="ink" onClick={onEdit}>
            ✎ edit this card
          </WobblyButton>
          <WobblyButton seed="focus-delete" variant="ghost" onClick={onDelete}>
            {confirmDelete ? 'really toss it?' : '✕ toss it'}
          </WobblyButton>
        </div>
      </PopupRow>
    </PersonaPopup>
  )
}
