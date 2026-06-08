import type { SessionTask } from '../../session'
import { GuidedReadingTaskPanel } from './GuidedReadingTaskPanel'
import { SentenceComprehensionTaskPanel } from './SentenceComprehensionTaskPanel'
import { SyllabificationTaskPanel } from './SyllabificationTaskPanel'
import { WarmupTaskPanel } from './WarmupTaskPanel'
import { WordBuildingTaskPanel } from './WordBuildingTaskPanel'

interface SessionTaskPanelProps {
  task: SessionTask
  taskCounterLabel: string
  onReadyForRating?: () => void
}

export function SessionTaskPanel({
  task,
  taskCounterLabel,
  onReadyForRating,
}: SessionTaskPanelProps) {
  if (task.kind === 'warmup') {
    return <WarmupTaskPanel task={task} taskCounterLabel={taskCounterLabel} />
  }

  if (task.kind === 'guided-reading') {
    return (
      <GuidedReadingTaskPanel
        key={task.id}
        task={task}
        taskCounterLabel={taskCounterLabel}
        onReadyForRating={onReadyForRating}
      />
    )
  }

  if (task.kind === 'word-building') {
    return (
      <WordBuildingTaskPanel
        key={task.id}
        task={task}
        taskCounterLabel={taskCounterLabel}
        onReadyForRating={onReadyForRating}
      />
    )
  }

  if (task.kind === 'sentence-comprehension') {
    return (
      <SentenceComprehensionTaskPanel
        key={task.id}
        task={task}
        taskCounterLabel={taskCounterLabel}
      />
    )
  }

  if (task.module === 'syllabification') {
    return (
      <SyllabificationTaskPanel
        key={task.id}
        task={task}
        taskCounterLabel={taskCounterLabel}
        onReadyForRating={onReadyForRating}
      />
    )
  }

  return (
    <article className="task-panel">
      <p className="task-counter">{taskCounterLabel}</p>
      <p className="task-title">{task.prompt}</p>
      <p className="task-display">{task.displayText}</p>
      {task.supportText && <p className="task-support">{task.supportText}</p>}
    </article>
  )
}
