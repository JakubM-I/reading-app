import { useState } from 'react'
import './App.css'
import {
  LevelScreen,
  ProgressScreen,
  ResetScreen,
  SessionScreen,
  StartScreen,
  type LevelOption,
  type StartScreenSummary,
} from './components/screens'
import { contentSummary, exerciseContent } from './content'
import type { ContentLevel } from './content/contentTypes'
import {
  clearProgress,
  createEmptyProgress,
  createProgressBackup,
  createProgressBackupFilename,
  loadProgress,
  recordCompletedSession,
  saveProgress,
  type ProgressBadge,
  type StoredProgress,
} from './progress'
import {
  createReadingSession,
  rateCurrentTask,
  type ReadingSession,
  type SessionRating,
} from './session'

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
  const [activeSession, setActiveSession] = useState<ReadingSession | null>(null)
  const [progress, setProgress] = useState<StoredProgress>(() => loadProgress())
  const [latestSessionBadges, setLatestSessionBadges] = useState<ProgressBadge[]>([])
  const selectedLevel = levels.find((level) => level.id === selectedLevelId) ?? levels[0]

  const chooseLevel = (level: ContentLevel) => {
    setSelectedLevelId(level.id)
    setLatestSessionBadges([])
    setActiveSession(createReadingSession(level.id, exerciseContent))
    setView('session')
  }

  const resetCurrentSession = () => {
    if (!selectedLevel) {
      return
    }

    setLatestSessionBadges([])
    setActiveSession(createReadingSession(selectedLevel.id, exerciseContent))
    setView('session')
  }

  const rateTask = (rating: SessionRating) => {
    if (!activeSession) {
      return
    }

    const nextSession = rateCurrentTask(activeSession, rating)
    setActiveSession(nextSession)

    if (activeSession.status === 'active' && nextSession.status === 'completed') {
      const nextProgress = recordCompletedSession(progress, nextSession)
      const previousBadgeIds = new Set(progress.badges.map((badge) => badge.id))
      const newBadges = nextProgress.badges.filter(
        (badge) => !previousBadgeIds.has(badge.id),
      )
      saveProgress(nextProgress)
      setProgress(nextProgress)
      setLatestSessionBadges(newBadges)
    }
  }

  const returnHome = () => {
    setView('start')
  }

  const exportProgressBackup = () => {
    const backup = createProgressBackup(progress)
    const blob = new Blob([backup], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = createProgressBackupFilename()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const importProgressBackup = (nextProgress: StoredProgress) => {
    saveProgress(nextProgress)
    setProgress(nextProgress)
    setLatestSessionBadges([])
    setActiveSession(null)
    setView('progress')
  }

  const resetAllProgress = () => {
    clearProgress()
    setProgress(createEmptyProgress())
    setActiveSession(null)
    setView('start')
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="stage-label">Etap 9</p>
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
          progress={progress}
          onExportProgress={exportProgressBackup}
          onImportProgress={importProgressBackup}
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
      {view === 'session' && selectedLevel && activeSession && (
        <SessionScreen
          level={selectedLevel}
          session={activeSession}
          earnedBadges={latestSessionBadges}
          onBack={() => setView('levels')}
          onRateTask={rateTask}
          onReset={resetCurrentSession}
          onReturnHome={returnHome}
        />
      )}
      {view === 'progress' && (
        <ProgressScreen
          progress={progress}
          onBack={() => setView('start')}
          onExportProgress={exportProgressBackup}
          onImportProgress={importProgressBackup}
        />
      )}
      {view === 'reset' && (
        <ResetScreen
          progress={progress}
          onBack={() => setView('start')}
          onResetProgress={resetAllProgress}
        />
      )}
    </main>
  )
}

export default App
