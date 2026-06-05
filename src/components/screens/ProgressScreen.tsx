import {
  badgeThresholds,
  getProgressOverview,
  type StoredProgress,
} from '../../progress'
import { ProgressBackupControls } from './ProgressBackupControls'

interface ProgressScreenProps {
  progress: StoredProgress
  onBack: () => void
  onExportProgress: () => void
  onImportProgress: (progress: StoredProgress) => void
}

export function ProgressScreen({
  progress,
  onBack,
  onExportProgress,
  onImportProgress,
}: ProgressScreenProps) {
  const overview = getProgressOverview(progress)
  const periods = [overview.today, overview.week, overview.month]
  const earnedBadgeIds = new Set(overview.badges.map((badge) => badge.id))
  const latestSessions = [...progress.sessions]
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    )
    .slice(0, 3)

  return (
    <section className="screen-section progress-screen" aria-labelledby="progress-title">
      <div className="progress-topbar">
        <button type="button" className="secondary-button compact-action" onClick={onBack}>
          ← Powrót
        </button>
        <h2 id="progress-title">Postępy</h2>
        <span className="home-mark" aria-hidden="true">⌂</span>
      </div>

      <div className="progress-total-grid" aria-label="Podsumowanie łączne">
        <div>
          <h3>Punkty <span aria-hidden="true">★</span></h3>
          <p>{overview.totalPoints}</p>
        </div>
        <div>
          <h3>Sesje <span aria-hidden="true">⚑</span></h3>
          <p>{overview.totalSessions}</p>
        </div>
        <div>
          <h3>Odznaki <span aria-hidden="true">⬟</span></h3>
          <p>
            {overview.badges.length} <span>/ {badgeThresholds.length}</span>
          </p>
        </div>
      </div>

      <div className="progress-dashboard">
        <div className="progress-column">
          <section className="period-panel activity-panel">
            <div className="period-heading">
              <h3>Aktywność</h3>
              <div className="period-tabs" aria-label="Okres">
                {periods.map((period, index) => (
                  <span className={index === 0 ? 'active' : ''} key={period.label}>
                    {period.label.replace('Ten ', '')}
                  </span>
                ))}
              </div>
            </div>

            <dl className="activity-list">
              <div>
                <dt>Zadania wykonane</dt>
                <dd>{overview.today.tasks} / 10</dd>
              </div>
              <div>
                <dt>Punkty zdobyte</dt>
                <dd>{overview.today.points}</dd>
              </div>
              <div>
                <dt>Nowe odznaki</dt>
                <dd>{overview.today.badges.length}</dd>
              </div>
            </dl>
          </section>

          <section className="period-panel recent-panel">
            <h3>Ostatnie sesje</h3>
            {latestSessions.length > 0 ? (
              <ul>
                {latestSessions.map((session) => (
                  <li key={session.id}>
                    <span>{formatSessionDate(session.completedAt)}</span>
                    <strong>{session.totalPoints} pkt</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Brak zapisanych sesji</p>
            )}
          </section>
        </div>

        <section className="badge-shelf" aria-label="Półka odznak">
          <h3>Półka odznak</h3>
          <div className="badge-grid">
            {badgeThresholds.map((badge, index) => {
              const isEarned = earnedBadgeIds.has(badge.id)

              return (
                <div className={isEarned ? 'driver-badge earned' : 'driver-badge'} key={badge.id}>
                  <span aria-hidden="true">{badgeIcons[index] ?? '⬟'}</span>
                  <p>{badge.label}</p>
                </div>
              )
            })}
            {badgeThresholds.length % 3 !== 0 && (
              <div className="driver-badge empty" aria-hidden="true">
                <span />
                <p>&nbsp;</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="backup-strip">
        <div>
          <h3>Kopia zapasowa</h3>
          <p>Eksportuj lub importuj postępy.</p>
        </div>
          <ProgressBackupControls
            progress={progress}
            onExportProgress={onExportProgress}
            onImportProgress={onImportProgress}
          />
      </section>
    </section>
  )
}

const badgeIcons = ['⌁', '◉', '▤', '▦', '✚']

const formatSessionDate = (value: string) => {
  const date = new Date(value)

  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
