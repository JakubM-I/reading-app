import {
  getScopeProgress,
  type ProgressScope,
  type StoredProgress,
  type ProgressSessionRecord,
} from '../../progress'
import { exerciseContent } from '../../content'
import { SessionJournal } from './SessionJournal'
import { formatSessionDate } from './sessionJournalFormat'

interface ProgressDetailsScreenProps {
  progress: StoredProgress
  scope: ProgressScope
  onBack: () => void
  onRepeatSession: (session: ProgressSessionRecord) => void
}

export function ProgressDetailsScreen({
  progress,
  scope,
  onBack,
  onRepeatSession,
}: ProgressDetailsScreenProps) {
  const summary = getScopeProgress(progress, scope)
  const title = getScopeTitle(scope)

  return (
    <section className="screen-section progress-details-screen" aria-labelledby="details-title">
      <div className="progress-topbar">
        <button type="button" className="secondary-button compact-action" onClick={onBack}>
          ← Postępy
        </button>
        <h2 id="details-title">{title}</h2>
        <span className="home-mark" aria-hidden="true" />
      </div>

      <section className="scope-summary-panel">
        <h3>Podsumowanie</h3>
        <p>
          {summary.lastPracticedAt
            ? `Ostatnia sesja: ${formatSessionDate(summary.lastPracticedAt)}`
            : 'Jeszcze bez zapisanych sesji.'}
        </p>
        <dl>
          <div><dt>Sesje</dt><dd>{summary.sessions.length}</dd></div>
          <div><dt>Zadania</dt><dd>{summary.tasks}</dd></div>
          <div><dt>Sam.</dt><dd>{summary.counts.independent}</dd></div>
          <div><dt>Z pomocą</dt><dd>{summary.counts['with-help']}</dd></div>
          <div><dt>Trudne</dt><dd>{summary.counts.hard}</dd></div>
          <div><dt>Pominięte</dt><dd>{summary.counts.skip}</dd></div>
        </dl>
      </section>

      <section className="session-journal scope-journal" aria-labelledby="scope-journal-title">
        <header>
          <h3 id="scope-journal-title">Historia sesji</h3>
          <p>Wybierz sesję, aby spokojnie zobaczyć wykonane ćwiczenia.</p>
        </header>
        <SessionJournal sessions={summary.sessions} onRepeatSession={onRepeatSession} />
      </section>
    </section>
  )
}

const getScopeTitle = (scope: ProgressScope) => {
  if (scope.module === 'reading') {
    const level = exerciseContent.levels.find((item) => item.id === scope.id)
    return level ? `Czytanie · poziom ${level.order}` : 'Czytanie'
  }

  const structure = exerciseContent.structures.find((item) => item.id === scope.id)
  return structure
    ? `Sylabizowanie · struktura ${structure.order} · ${structure.pattern}`
    : 'Sylabizowanie'
}
