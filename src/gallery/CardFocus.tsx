import { useState } from 'react'
import type { Recipe } from '../state/types'
import { uid } from '../state/types'
import { PersonaPopup, PopupRow } from '../components/persona/PersonaPopup'
import { PersonaTitle } from '../components/persona/PersonaTitle'
import { WobblyButton } from '../components/handmade/WobblyButton'
import { showToast } from '../components/handmade/toastBus'
import { IndexCard } from '../recipe/IndexCard'
import { exportRecipePng } from '../lib/exportPng'
import { downloadRecipeJson } from '../lib/recipeJson'
import { useRecipes } from '../state/RecipesContext'
import { useScene } from '../state/SceneContext'
import { useSfx } from '../audio/useSfx'

interface CardFocusProps {
  recipe: Recipe
  onClose: () => void
  /** read-only owner recipe: hide edit/delete, offer "remix into my board" */
  house?: boolean
}

/** Full-size look at a pinned recipe, with the grown-up buttons. */
export function CardFocus({ recipe, onClose, house = false }: CardFocusProps) {
  const { editRecipe, deleteRecipe, loadDraft } = useRecipes()
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

  const onExportJson = () => {
    downloadRecipeJson(recipe)
    play('ding')
    showToast('saved the recipe as json ♡')
  }

  // fork a fully-editable local copy with a fresh id (drops the house: prefix),
  // so the owner's card is untouched and the visitor lands on their own draft
  const onRemix = () => {
    loadDraft({ ...recipe, id: uid(), createdAt: Date.now(), updatedAt: Date.now() })
    showToast('copied to your board — make it yours ♡')
    onClose()
    goTo('maker')
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
        {/* keep the heading clear of the pinned ✕ chip in the top-right corner */}
        <div id={`focus-${recipe.id}`} className="pr-10">
          <PersonaTitle text={recipe.title || 'untitled brew'} size="md" seed={recipe.id} />
        </div>
      </PopupRow>
      <PopupRow>
        <div className="-mx-1.5 my-1 flex origin-top justify-center max-[880px]:-mb-20 max-[880px]:scale-80 max-[760px]:-mb-32 max-[760px]:scale-[0.66] max-[560px]:-mb-44 max-[560px]:scale-[0.52] max-[420px]:-mb-52 max-[420px]:scale-[0.44]">
          <IndexCard recipe={recipe} mode="static" />
        </div>
      </PopupRow>
      <PopupRow>
        <div className="flex flex-wrap items-center gap-3 pt-1.5">
          <WobblyButton seed="focus-export" variant="red" onClick={onExport} disabled={exporting}>
            {exporting ? 'brewing the png…' : '⤓ save as png'}
          </WobblyButton>
          <WobblyButton seed="focus-export-json" variant="paper" onClick={onExportJson}>
            ⤓ save as json
          </WobblyButton>
          {house ? (
            <WobblyButton seed="focus-remix" variant="ink" onClick={onRemix}>
              ↻ remix into my board
            </WobblyButton>
          ) : (
            <>
              <WobblyButton seed="focus-edit" variant="ink" onClick={onEdit}>
                ✎ edit this card
              </WobblyButton>
              <WobblyButton seed="focus-delete" variant="ghost" onClick={onDelete}>
                {confirmDelete ? 'really toss it?' : '✕ toss it'}
              </WobblyButton>
            </>
          )}
        </div>
      </PopupRow>
    </PersonaPopup>
  )
}
