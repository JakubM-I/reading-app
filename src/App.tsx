import { useState } from 'react'
import './App.css'
import {
  LevelScreen,
  ProgressPlaceholder,
  ResetPlaceholder,
  SessionPlaceholder,
  StartScreen,
  type LevelOption,
  type StartScreenSummary,
} from './components/screens'
import { contentSummary, exerciseContent } from './content'
import type { ContentLevel } from './content/contentTypes'

type AppView = 'start' | 'levels' | 'session' | 'progress' | 'reset'

const levels = [...exerciseContent.levels].sort((a, b) => a.order - b.order)

const levelOptions: LevelOption[] = levels.map((level) => ({
  level,
  wordCount: exerciseContent.words.filter((word) => word.levelId === level.id).length,
  sentenceCount: exerciseContent.sentences.filter(
    (sentence) => sentence.levelId === level.id,
  ).length,
}))

const startSummary: StartScreenSummary = {
  levels: contentSummary.levels,
  words: contentSummary.words,
  sentences: contentSummary.sentences,
}

function App() {
  const [view, setView] = useState<AppView>('start')
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0]?.id ?? '')
  const selectedLevel = levels.find((level) => level.id === selectedLevelId) ?? levels[0]

  const chooseLevel = (level: ContentLevel) => {
    setSelectedLevelId(level.id)
    setView('session')
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="stage-label">Etap 2</p>
          <h1>Czytanie krok po kroku</h1>
        </div>

        <nav className="app-nav" aria-label="Główna nawigacja">
          <button
            type="button"
            className={view === 'start' ? 'nav-button active' : 'nav-button'}
            aria-current={view === 'start' ? 'page' : undefined}
            onClick={() => setView('start')}
          >
            Start
          </button>
          <button
            type="button"
            className={view === 'levels' ? 'nav-button active' : 'nav-button'}
            aria-current={view === 'levels' ? 'page' : undefined}
            onClick={() => setView('levels')}
          >
            Poziomy
          </button>
          <button
            type="button"
            className={view === 'progress' ? 'nav-button active' : 'nav-button'}
            aria-current={view === 'progress' ? 'page' : undefined}
            onClick={() => setView('progress')}
          >
            Postępy
          </button>
        </nav>
      </header>

      {view === 'start' && (
        <StartScreen
          summary={startSummary}
          onStart={() => setView('levels')}
          onProgress={() => setView('progress')}
          onReset={() => setView('reset')}
        />
      )}
      {view === 'levels' && (
        <LevelScreen
          levels={levelOptions}
          onBack={() => setView('start')}
          onChooseLevel={chooseLevel}
        />
      )}
      {view === 'session' && selectedLevel && (
        <SessionPlaceholder
          level={selectedLevel}
          onBack={() => setView('levels')}
          onReset={() => setView('start')}
        />
      )}
      {view === 'progress' && (
        <ProgressPlaceholder onBack={() => setView('start')} />
      )}
      {view === 'reset' && <ResetPlaceholder onBack={() => setView('start')} />}
    </main>
  )
}

export default App
