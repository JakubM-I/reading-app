import { useState } from 'react'
import {
  badgeThresholds,
  canRepeatSession,
  getBestSessionAttempt,
  getModuleProgress,
  getProgressOverview,
  getStructureProgress,
  type ProgressSessionRecord,
  type StoredProgress,
} from '../../progress'
import { exerciseContent } from '../../content'
import { ratingLabels } from '../../session'
import { ProgressBackupControls } from './ProgressBackupControls'
import badgesIcon from '../../assets/odznaki.png'
import pointsIcon from '../../assets/punkty.png'
import sessionsIcon from '../../assets/sesje.png'
import firstRideBadge from '../../assets/pierwszy-przejazd.png'
import trainingDriverBadge from '../../assets/kierowca-treningowy.png'
import trackMasterBadge from '../../assets/mistrz-toru.png'
import superMechanicBadge from '../../assets/super-mechanik.png'
import garageLegendBadge from '../../assets/legenda-garazu.png'

const badgeImages: Record<string, string> = {
  'first-ride': firstRideBadge,
  'training-driver': trainingDriverBadge,
  'track-master': trackMasterBadge,
  'super-mechanic': superMechanicBadge,
  'garage-legend': garageLegendBadge,
}

type ProgressPeriodKey = 'today' | 'week' | 'month'

const periodTabs: { key: ProgressPeriodKey; label: string }[] = [
  { key: 'today', label: 'Dzisiaj' },
  { key: 'week', label: 'Tydzień' },
  { key: 'month', label: 'Miesiąc' },
]

interface ProgressScreenProps {
  progress: StoredProgress
  onBack: () => void
  onExportProgress: () => void
  onImportProgress: (progress: StoredProgress) => void
  onRepeatSession: (session: ProgressSessionRecord) => void
}

export function ProgressScreen({
  progress,
  onBack,
  onExportProgress,
  onImportProgress,
  onRepeatSession,
}: ProgressScreenProps) {
  const [activePeriodKey, setActivePeriodKey] = useState<ProgressPeriodKey>('today')
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)
  const overview = getProgressOverview(progress)
  const moduleProgress = getModuleProgress(progress)
  const structureProgress = getStructureProgress(
    progress,
    exerciseContent.structures.map((structure) => structure.id),
  )
  const activePeriod = overview[activePeriodKey]
  const earnedBadgeIds = new Set(overview.badges.map((badge) => badge.id))
  const latestSessions = [...progress.sessions]
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))
    .slice(0, 3)
  const sessions = [...progress.sessions].sort(
    (a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt),
  )

  return (
    <section className="screen-section progress-screen" aria-labelledby="progress-title">
      <div className="progress-topbar">
        <button type="button" className="secondary-button compact-action" onClick={onBack}>← Powrót</button>
        <h2 id="progress-title">Postępy</h2>
        <span className="home-mark" aria-hidden="true" />
      </div>

      <div className="progress-total-grid" aria-label="Podsumowanie łączne">
        <div><h3>Punkty <img src={pointsIcon} alt="" className="progress-block-icon" /></h3><p>{overview.totalPoints}</p></div>
        <div><h3>Sesje <img src={sessionsIcon} alt="" className="progress-block-icon" /></h3><p>{overview.totalSessions}</p></div>
        <div><h3>Odznaki <img src={badgesIcon} alt="" className="progress-block-icon" /></h3><p>{overview.badges.length} <span>/ {badgeThresholds.length}</span></p></div>
      </div>

      <div className="progress-dashboard">
        <div className="progress-column">
          <section className="period-panel activity-panel">
            <div className="period-heading">
              <div><h3>Aktywność</h3><p>{activePeriod.rangeLabel}</p></div>
              <div className="period-tabs" aria-label="Okres">
                {periodTabs.map((period) => <button type="button" className={activePeriodKey === period.key ? 'active' : ''} key={period.key} aria-pressed={activePeriodKey === period.key} onClick={() => setActivePeriodKey(period.key)}>{period.label}</button>)}
              </div>
            </div>
            <dl className="activity-list">
              <div><dt>Zadania wykonane</dt><dd>{activePeriod.tasks}</dd></div>
              <div><dt>Punkty zdobyte</dt><dd>{activePeriod.points}</dd></div>
              <div><dt>Nowe odznaki</dt><dd>{activePeriod.badges.length}</dd></div>
            </dl>
          </section>

          <section className="period-panel recent-panel">
            <h3>Ostatnie sesje</h3>
            {latestSessions.length > 0 ? <ul>{latestSessions.map((session) => <li key={session.id}><span>{formatSessionDate(session.completedAt)} · {formatSessionScope(session)}</span><strong>{session.totalPoints} pkt</strong></li>)}</ul> : <p>Brak zapisanych sesji</p>}
          </section>
        </div>

        <section className="badge-shelf" aria-label="Półka odznak">
          <h3>Półka odznak</h3>
          <div className="badge-grid">
            {badgeThresholds.map((badge) => {
              const isEarned = earnedBadgeIds.has(badge.id)
              return <div className={isEarned ? 'driver-badge earned' : 'driver-badge'} key={badge.id}><img src={badgeImages[badge.id]} alt="" className="badge-image" /><p>{badge.label}</p></div>
            })}
          </div>
        </section>
      </div>

      <section className="learning-progress-panel">
        <header><h3>Postępy w nauce</h3><p>To spokojne podsumowanie obu modułów.</p></header>
        <div className="module-progress-grid">
          {moduleProgress.map((summary) => <section key={summary.module} className="module-progress-card">
            <h4>{summary.module === 'reading' ? 'Czytanie' : 'Sylabizowanie'}</h4>
            <p>{summary.lastPracticedAt ? `Ostatnio: ${formatSessionDate(summary.lastPracticedAt)}` : 'Jeszcze bez ćwiczeń'}</p>
            <dl><div><dt>Sesje</dt><dd>{summary.sessions}</dd></div><div><dt>Zadania</dt><dd>{summary.tasks}</dd></div><div><dt>Sam.</dt><dd>{summary.counts.independent}</dd></div><div><dt>Z pomocą</dt><dd>{summary.counts['with-help']}</dd></div><div><dt>Trudne</dt><dd>{summary.counts.hard}</dd></div><div><dt>Pominięte</dt><dd>{summary.counts.skip}</dd></div></dl>
          </section>)}
        </div>

        <section className="structure-progress-panel">
          <h4>Sylabizowanie · struktury</h4>
          <p className="panel-note">Liczby opisują próby, nie ocenę opanowania.</p>
          <div className="structure-progress-list">
            {exerciseContent.structures.map((structure) => {
              const summary = structureProgress.find((item) => item.structureId === structure.id)
              return <div className="structure-progress-row" key={structure.id}><div><strong>Struktura {structure.order} · {structure.pattern}</strong><span>{summary?.lastPracticedAt ? `Ostatnio: ${formatSessionDate(summary.lastPracticedAt)}` : 'Jeszcze bez ćwiczeń'}</span></div><dl><div><dt>Próby</dt><dd>{summary?.tasks ?? 0}</dd></div><div><dt>Sam.</dt><dd>{summary?.counts.independent ?? 0}</dd></div><div><dt>Z pomocą</dt><dd>{summary?.counts['with-help'] ?? 0}</dd></div><div><dt>Trudne</dt><dd>{summary?.counts.hard ?? 0}</dd></div><div><dt>Pominięte</dt><dd>{summary?.counts.skip ?? 0}</dd></div></dl></div>
            })}
          </div>
        </section>

        <section className="session-journal" aria-labelledby="journal-title">
          <header><h4 id="journal-title">Dziennik sesji</h4><p>Możesz spokojnie sprawdzić, co było łatwe, a co wymagało wsparcia.</p></header>
          {sessions.length > 0 ? <ul>{sessions.map((session) => {
            const bestAttempt = getBestSessionAttempt(session)
            const isExpanded = expandedSessionId === session.id
            return <li key={session.id} className="journal-entry">
              <div className="journal-row"><div><strong>{formatSessionScope(session)}</strong><span>{formatSessionDate(session.completedAt)} · {bestAttempt.totalPoints} pkt{session.attempts.length > 1 ? ` · powtórki: ${session.attempts.length - 1}` : ''}</span></div><button type="button" className="secondary-button compact-action" aria-expanded={isExpanded} onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}>{isExpanded ? 'Ukryj wykonanie' : 'Pokaż wykonanie'}</button></div>
              {isExpanded && <div className="journal-details">
                {session.attempts.map((attempt) => <details key={attempt.id} open={attempt.id === session.bestAttemptId}><summary>{attempt.id === session.bestAttemptId ? 'Najlepszy wynik' : 'Wcześniejsze podejście'} · {formatSessionDate(attempt.completedAt)} · {attempt.totalPoints} pkt</summary><ul className="task-record-list">{attempt.tasks.map((task) => <li key={task.taskId}><span>{task.reviewText}</span><span>{ratingLabels[task.rating]} · {task.points} pkt</span></li>)}</ul></details>)}
                {canRepeatSession(session) ? <button type="button" className="primary-button journal-repeat" onClick={() => onRepeatSession(session)}>Powtórz tę sesję</button> : !session.sessionTasks ? <p className="panel-note">Ta starsza sesja jest dostępna do podglądu.</p> : <p className="panel-note">Ta sesja została wykonana samodzielnie.</p>}
              </div>}
            </li>
          })}</ul> : <p>Brak zapisanych sesji</p>}
        </section>
      </section>

      <section className="backup-strip"><div><h3>Kopia zapasowa</h3><p>Eksportuj lub importuj postępy.</p></div><ProgressBackupControls progress={progress} onExportProgress={onExportProgress} onImportProgress={onImportProgress} /></section>
    </section>
  )
}

const formatSessionDate = (value: string) => new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value))

const formatSessionScope = (session: ProgressSessionRecord) => {
  if (session.module === 'reading') {
    const levelNumber = session.levelId?.replace('level-', '')
    return levelNumber ? `Czytanie · poziom ${levelNumber}` : 'Czytanie'
  }
  const structure = exerciseContent.structures.find((item) => item.id === session.structureId)
  return structure ? `Sylabizowanie · struktura ${structure.order}` : 'Sylabizowanie'
}
