import type { SessionTask } from '../../session'

interface SentenceComprehensionTaskPanelProps {
  task: SessionTask
  taskCounterLabel: string
}

export function SentenceComprehensionTaskPanel({
  task,
  taskCounterLabel,
}: SentenceComprehensionTaskPanelProps) {
  return (
    <article className="task-panel sentence-comprehension-task" aria-label="Zdanie i pytanie">
      <p className="task-counter">{taskCounterLabel}</p>
      <p className="task-title">{task.prompt}</p>

      <div className="guided-sentence">
        <p className="reading-sentence" lang="pl">
          {task.displayText}
        </p>
        {task.supportText && (
          <div className="guided-question">
            <span>Pytanie</span>
            <strong>{task.supportText}</strong>
          </div>
        )}
      </div>
    </article>
  )
}
