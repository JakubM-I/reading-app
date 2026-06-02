import type { SessionTask } from '../../session'
import { WarmupTaskPanel } from './WarmupTaskPanel'

interface SessionTaskPanelProps {
  task: SessionTask
}

export function SessionTaskPanel({ task }: SessionTaskPanelProps) {
  if (task.kind === 'warmup') {
    return <WarmupTaskPanel task={task} />
  }

  return (
    <article className="task-panel">
      <p className="task-title">{task.prompt}</p>
      <p className="task-display">{task.displayText}</p>
      {task.supportText && <p className="task-support">{task.supportText}</p>}
    </article>
  )
}
