import { useState } from 'react'
import './App.css'
import {
  LevelScreen,
  ModuleChoiceScreen,
  ProgressScreen,
  ResetScreen,
  SessionScreen,
  StartScreen,
  StructureScreen,
  SyllabificationModeScreen,
  type LevelOption,
  type StartScreenSummary,
  type StructureOption,
} from './components/screens'
import { contentSummary, exerciseContent } from './content'
import type {
  ContentLevel,
  ContentStructure,
  StructureId,
} from './content/contentTypes'
import {
  clearProgress,
  createEmptyProgress,
  createProgressBackup,
  createProgressBackupFilename,
  loadProgress,
  recordCompletedSession,
  recordRepeatedSession,
  saveProgress,
  type ProgressBadge,
  type ProgressSessionRecord,
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
const structures = [...exerciseContent.structures].sort((a, b) => a.order - b.order)

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

const structureOptions: StructureOption[] = structures.map((structure) => ({
  structure,
  wordCount: exerciseContent.decodingWords.filter(
    (item) => item.structureId === structure.id,
  ).length,
  pseudowordCount: exerciseContent.pseudowords.filter(
    (item) => item.structureId === structure.id,
  ).length,
}))

const startSummary: StartScreenSummary = {
  levels: contentSummary.levels,
  words: contentSummary.words,
  sentences: contentSummary.sentences,
}

const createReplaySession = (
  record: ProgressSessionRecord,
): ReadingSession | null => {
  if (!record.sessionTasks?.length) {
    return null
  }

  if (record.module === 'reading' && record.levelId) {
    return {
      id: record.id,
      module: 'reading',
      levelId: record.levelId,
      tasks: record.sessionTasks,
      currentTaskIndex: 0,
      answers: [],
      status: 'active',
    }
  }

  if (
    record.module === 'syllabification' &&
    record.structureId &&
    record.supportMode
  ) {
    return {
      id: record.id,
      module: 'syllabification',
      structureId: record.structureId,
      supportMode: record.supportMode,
      includePseudowords: record.includePseudowords ?? true,
      difficultyStage: record.sessionTasks[0].difficultyStage ?? 'basic',
      tasks: record.sessionTasks,
      currentTaskIndex: 0,
      answers: [],
      status: 'active',
    }
  }

  return null
}

function App() {
  const [view, setView] = useState<AppView>('start')
  const [selectedModule, setSelectedModule] = useState<SessionModule>('reading')
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0]?.id ?? '')
  const [selectedStructureId, setSelectedStructureId] = useState<StructureId>(
    structures[0]?.id ?? 'structure-1',
  )
  const [selectedSyllabificationMode, setSelectedSyllabificationMode] =
    useState<SyllabificationSupportMode | undefined>(undefined)
  const [includePseudowords, setIncludePseudowords] = useState(true)
  const [activeSession, setActiveSession] = useState<ReadingSession | null>(null)
  const [progress, setProgress] = useState<StoredProgress>(() => loadProgress())
  const [latestSessionBadges, setLatestSessionBadges] = useState<ProgressBadge[]>([])
  const [repeatedSessionId, setRepeatedSessionId] = useState<string | null>(null)
  const selectedLevel = levels.find((level) => level.id === selectedLevelId) ?? levels[0]
  const selectedStructure =
    structures.find((structure) => structure.id === selectedStructureId) ?? structures[0]

  const chooseModule = (module: SessionModule) => {
    setSelectedModule(module)
    setLatestSessionBadges([])
    setActiveSession(null)
    setSelectedSyllabificationMode(undefined)
    setIncludePseudowords(true)
    setView('levels')
  }

  const chooseStructure = (structure: ContentStructure) => {
    setSelectedStructureId(structure.id)
    setLatestSessionBadges([])
    setActiveSession(null)
    setSelectedSyllabificationMode(undefined)
    setIncludePseudowords(true)
    setView('syllabification-mode')
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
  }

  const startReadingSession = (levelId: string) => {
    setRepeatedSessionId(null)
    setActiveSession(
      createReadingSession(levelId, exerciseContent, {
        materialProgress: progress.materialProgress,
        sessionIndex: progress.sessions.length,
      }),
    )
    setView('session')
  }

  const startSyllabificationSession = (
    structureId: StructureId,
    mode: SyllabificationSupportMode,
  ) => {
    setRepeatedSessionId(null)
    setActiveSession(
      createSyllabificationSession(
        structureId,
        mode,
        includePseudowords,
        exerciseContent,
        {
        materialProgress: progress.materialProgress,
        sessionIndex: progress.sessions.length,
        },
      ),
    )
    setView('session')
  }

  const startSelectedSyllabificationSession = () => {
    if (!selectedSyllabificationMode || !selectedStructure) {
      return
    }

    startSyllabificationSession(selectedStructure.id, selectedSyllabificationMode)
  }

  const resetCurrentSession = () => {
    setLatestSessionBadges([])
    if (repeatedSessionId) {
      const record = progress.sessions.find((item) => item.id === repeatedSessionId)
      const replay = record ? createReplaySession(record) : null

      if (replay) {
        setActiveSession(replay)
      }
      return
    }

    if (selectedModule === 'syllabification' && selectedSyllabificationMode) {
      startSyllabificationSession(selectedStructureId, selectedSyllabificationMode)
      return
    }

    if (selectedLevel) {
      startReadingSession(selectedLevel.id)
    }
  }

  const rateTask = (rating: SessionRating) => {
    if (!activeSession) {
      return
    }

    const nextSession = rateCurrentTask(activeSession, rating)
    setActiveSession(nextSession)

    if (activeSession.status === 'active' && nextSession.status === 'completed') {
      const nextProgress = repeatedSessionId
        ? recordRepeatedSession(progress, repeatedSessionId, nextSession)
        : recordCompletedSession(progress, nextSession)
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
    setRepeatedSessionId(null)
    setView('start')
  }

  const repeatSavedSession = (record: ProgressSessionRecord) => {
    const replay = createReplaySession(record)

    if (!replay) {
      return
    }

    setSelectedModule(record.module)
    if (record.module === 'reading' && record.levelId) {
      setSelectedLevelId(record.levelId)
    }
    if (record.module === 'syllabification') {
      if (record.structureId) setSelectedStructureId(record.structureId)
      setSelectedSyllabificationMode(record.supportMode)
      setIncludePseudowords(record.includePseudowords ?? true)
    }
    setLatestSessionBadges([])
    setRepeatedSessionId(record.id)
    setActiveSession(replay)
    setView('session')
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
      {view === 'levels' && selectedModule === 'reading' && (
        <LevelScreen
          levels={levelOptions}
          module={selectedModule}
          onBack={() => setView('modules')}
          onChooseLevel={chooseLevel}
          onProgress={() => setView('progress')}
        />
      )}
      {view === 'levels' && selectedModule === 'syllabification' && (
        <StructureScreen
          structures={structureOptions}
          onBack={() => setView('modules')}
          onChooseStructure={chooseStructure}
          onProgress={() => setView('progress')}
        />
      )}
      {view === 'syllabification-mode' && selectedStructure && (
        <SyllabificationModeScreen
          structure={selectedStructure}
          selectedMode={selectedSyllabificationMode}
          includePseudowords={includePseudowords}
          onBack={() => setView('levels')}
          onChooseMode={chooseSyllabificationMode}
          onIncludePseudowordsChange={setIncludePseudowords}
          onStart={startSelectedSyllabificationSession}
        />
      )}
      {view === 'session' && activeSession && (
        <SessionScreen
          level={activeSession.module === 'reading' ? selectedLevel : undefined}
          structure={
            activeSession.module === 'syllabification' ? selectedStructure : undefined
          }
          session={activeSession}
          earnedBadges={latestSessionBadges}
          isSessionReplay={Boolean(repeatedSessionId)}
          onBack={() =>
            setView(repeatedSessionId ? 'progress' : selectedModule === 'reading' ? 'levels' : 'syllabification-mode')
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
          onRepeatSession={repeatSavedSession}
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
