import { SettingsProvider } from './state/SettingsContext'
import { RecipesProvider } from './state/RecipesContext'
import { SceneProvider } from './state/SceneContext'
import { AppShell } from './AppShell'

export default function App() {
  return (
    <SettingsProvider>
      <RecipesProvider>
        <SceneProvider>
          <AppShell />
        </SceneProvider>
      </RecipesProvider>
    </SettingsProvider>
  )
}
