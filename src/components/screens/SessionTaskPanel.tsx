import type { SessionTask } from '../../session'
import { GuidedReadingTaskPanel } from './GuidedReadingTaskPanel'
import { WarmupTaskPanel } from './WarmupTaskPanel'

interface SessionTaskPanelProps {
  task: SessionTask
  onReadyForRating?: () => void
}

export function SessionTaskPanel({ task, onReadyForRating }: SessionTaskPanelProps) {
  if (task.kind === 'warmup') {
    return <WarmupTaskPanel task={task} />
  }

  if (task.kind === 'guided-reading') {
    return (
      <GuidedReadingTaskPanel
        key={task.id}
        task={task}
        onReadyForRating={onReadyForRating}
      />
    )
  }

  return (
    <article className="task-panel">
      <p className="task-title">{task.prompt}</p>
      <p className="task-display">{task.displayText}</p>
      {task.supportText && <p className="task-support">{task.supportText}</p>}
    </article>
  )
}
