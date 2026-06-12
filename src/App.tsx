import { SettingsProvider } from './state/SettingsContext'
import { RecipesProvider } from './state/RecipesContext'
import { SceneProvider } from './state/SceneContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AppShell } from './AppShell'

export default function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <RecipesProvider>
          <SceneProvider>
            <AppShell />
          </SceneProvider>
        </RecipesProvider>
      </SettingsProvider>
    </ErrorBoundary>
  )
}
