import { useState } from 'react'
import {
  canRepeatSession,
  getBestSessionAttempt,
  type ProgressSessionRecord,
} from '../../progress'
import { ratingLabels } from '../../session'
import { formatSessionDate, formatSessionLabel } from './sessionJournalFormat'

interface SessionJournalProps {
  sessions: ProgressSessionRecord[]
  onRepeatSession: (session: ProgressSessionRecord) => void
}

export function SessionJournal({ sessions, onRepeatSession }: SessionJournalProps) {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)

  if (sessions.length === 0) {
    return <p>Brak zapisanych sesji</p>
  }

  return (
    <ul>
      {sessions.map((session) => {
        const bestAttempt = getBestSessionAttempt(session)
        const isExpanded = expandedSessionId === session.id

        return (
          <li key={session.id} className="journal-entry">
            <div className="journal-row">
              <div>
                <strong>{formatSessionLabel(session)}</strong>
                <span>
                  {formatSessionDate(session.completedAt)} · {bestAttempt.totalPoints} pkt
                  {session.attempts.length > 1
                    ? ` · powtórki: ${session.attempts.length - 1}`
                    : ''}
                </span>
              </div>
              <button
                type="button"
                className="secondary-button compact-action"
                aria-expanded={isExpanded}
                onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
              >
                {isExpanded ? 'Ukryj wykonanie' : 'Pokaż wykonanie'}
              </button>
            </div>
            {isExpanded && (
              <div className="journal-details">
                {session.attempts.map((attempt) => (
                  <details key={attempt.id} open={attempt.id === session.bestAttemptId}>
                    <summary>
                      {attempt.id === session.bestAttemptId
                        ? 'Najlepszy wynik'
                        : 'Wcześniejsze podejście'}
                      {' · '}{formatSessionDate(attempt.completedAt)} · {attempt.totalPoints} pkt
                    </summary>
                    <ul className="task-record-list">
                      {attempt.tasks.map((task) => (
                        <li key={task.taskId}>
                          <span>{task.reviewText}</span>
                          <span>{ratingLabels[task.rating]} · {task.points} pkt</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
                {canRepeatSession(session) ? (
                  <button
                    type="button"
                    className="primary-button journal-repeat"
                    onClick={() => onRepeatSession(session)}
                  >
                    Powtórz tę sesję
                  </button>
                ) : !session.sessionTasks ? (
                  <p className="panel-note">Ta starsza sesja jest dostępna do podglądu.</p>
                ) : (
                  <p className="panel-note">Ta sesja została wykonana samodzielnie.</p>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
