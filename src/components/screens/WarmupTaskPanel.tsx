import type { SessionTask } from '../../session'

interface WarmupTaskPanelProps {
  task: SessionTask
}

export function WarmupTaskPanel({ task }: WarmupTaskPanelProps) {
  return (
    <article className="task-panel warmup-task" aria-label="Rozgrzewka">
      <div className="warmup-meta">
        <span>{task.supportText}</span>
        <span>Rozgrzewka</span>
      </div>
      <p className="task-title">{task.prompt}</p>
      <p className="warmup-display" lang="pl">
        {task.displayText}
      </p>
      <p className="warmup-note">Jedno spokojne odczytanie wystarczy.</p>
    </article>
  )
}
