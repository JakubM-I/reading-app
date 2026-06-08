import { useState } from 'react'
import './App.css'
import {
  LevelScreen,
  ModuleChoiceScreen,
  ProgressScreen,
  ResetScreen,
  SessionScreen,
  StartScreen,
  SyllabificationModeScreen,
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
  createSyllabificationSession,
  rateCurrentTask,
  type ReadingSession,
  type SessionRating,
  type SessionModule,
  type SyllabificationSupportMode,
} from './session'

type AppView =
  | 'start'
  | 'modules'
  | 'levels'
  | 'syllabification-mode'
  | 'session'
  | 'progress'
  | 'reset'

const levels = [...exerciseContent.levels].sort((a, b) => a.order - b.order)

const levelOptions: LevelOption[] = levels.map((level) => ({
  level,
  wordCount: exerciseContent.words.filter((word) => word.levelId === level.id).length,
  sentenceCount: exerciseContent.sentences.filter(
    (sentence) => sentence.levelId === level.id,
  ).length,
  syllabificationWordCount: exerciseContent.words.filter(
    (word) => word.levelId === level.id && word.suitableForSyllabification,
  ).length,
}))

const startSummary: StartScreenSummary = {
  levels: contentSummary.levels,
  words: contentSummary.words,
  sentences: contentSummary.sentences,
}

function App() {
  const [view, setView] = useState<AppView>('start')
  const [selectedModule, setSelectedModule] = useState<SessionModule>('reading')
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0]?.id ?? '')
  const [selectedSyllabificationMode, setSelectedSyllabificationMode] =
    useState<SyllabificationSupportMode | undefined>(undefined)
  const [activeSession, setActiveSession] = useState<ReadingSession | null>(null)
  const [progress, setProgress] = useState<StoredProgress>(() => loadProgress())
  const [latestSessionBadges, setLatestSessionBadges] = useState<ProgressBadge[]>([])
  const selectedLevel = levels.find((level) => level.id === selectedLevelId) ?? levels[0]

  const chooseModule = (module: SessionModule) => {
    setSelectedModule(module)
    setLatestSessionBadges([])
    setActiveSession(null)
    setSelectedSyllabificationMode(undefined)
    setView('levels')
  }

  const chooseLevel = (level: ContentLevel) => {
    setSelectedLevelId(level.id)
    setLatestSessionBadges([])

    if (selectedModule === 'syllabification') {
      setActiveSession(null)
      setSelectedSyllabificationMode(undefined)
      setView('syllabification-mode')
      return
    }

    startReadingSession(level.id)
  }

  const chooseSyllabificationMode = (mode: SyllabificationSupportMode) => {
    setSelectedSyllabificationMode(mode)
    startSyllabificationSession(selectedLevel.id, mode)
  }

  const startReadingSession = (levelId: string) => {
    setActiveSession(
      createReadingSession(levelId, exerciseContent, {
        materialProgress: progress.materialProgress,
        sessionIndex: progress.sessions.length,
      }),
    )
    setView('session')
  }

  const startSyllabificationSession = (
    levelId: string,
    mode: SyllabificationSupportMode,
  ) => {
    setActiveSession(
      createSyllabificationSession(levelId, mode, exerciseContent, {
        materialProgress: progress.materialProgress,
        sessionIndex: progress.sessions.length,
      }),
    )
    setView('session')
  }

  const resetCurrentSession = () => {
    if (!selectedLevel) {
      return
    }

    setLatestSessionBadges([])
    if (selectedModule === 'syllabification' && selectedSyllabificationMode) {
      startSyllabificationSession(selectedLevel.id, selectedSyllabificationMode)
      return
    }

    startReadingSession(selectedLevel.id)
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
      {view === 'start' && (
        <StartScreen
          summary={startSummary}
          progress={progress}
          onExportProgress={exportProgressBackup}
          onImportProgress={importProgressBackup}
          onStart={() => setView('modules')}
          onProgress={() => setView('progress')}
          onReset={() => setView('reset')}
        />
      )}
      {view === 'modules' && (
        <ModuleChoiceScreen
          onBack={() => setView('start')}
          onChooseModule={chooseModule}
          onProgress={() => setView('progress')}
        />
      )}
      {view === 'levels' && (
        <LevelScreen
          levels={levelOptions}
          module={selectedModule}
          onBack={() => setView('modules')}
          onChooseLevel={chooseLevel}
          onProgress={() => setView('progress')}
        />
      )}
      {view === 'syllabification-mode' && selectedLevel && (
        <SyllabificationModeScreen
          level={selectedLevel}
          selectedMode={selectedSyllabificationMode}
          onBack={() => setView('levels')}
          onChooseMode={chooseSyllabificationMode}
        />
      )}
      {view === 'session' && selectedLevel && activeSession && (
        <SessionScreen
          level={selectedLevel}
          session={activeSession}
          earnedBadges={latestSessionBadges}
          onBack={() =>
            setView(
              selectedModule === 'reading' ? 'levels' : 'syllabification-mode',
            )
          }
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
