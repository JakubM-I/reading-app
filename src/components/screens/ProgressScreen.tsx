import { useState } from 'react'
import {
  badgeThresholds,
  getProgressOverview,
  type StoredProgress,
} from '../../progress'
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
}

export function ProgressScreen({
  progress,
  onBack,
  onExportProgress,
  onImportProgress,
}: ProgressScreenProps) {
  const [activePeriodKey, setActivePeriodKey] =
    useState<ProgressPeriodKey>('today')
  const overview = getProgressOverview(progress)
  const activePeriod = overview[activePeriodKey]
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
        <span className="home-mark" aria-hidden="true" />
      </div>

      <div className="progress-total-grid" aria-label="Podsumowanie łączne">
        <div>
          <h3>
            Punkty
            <img src={pointsIcon} alt="" className="progress-block-icon" aria-hidden="true" />
          </h3>
          <p>{overview.totalPoints}</p>
        </div>
        <div>
          <h3>
            Sesje
            <img src={sessionsIcon} alt="" className="progress-block-icon" aria-hidden="true" />
          </h3>
          <p>{overview.totalSessions}</p>
        </div>
        <div>
          <h3>
            Odznaki
            <img src={badgesIcon} alt="" className="progress-block-icon" aria-hidden="true" />
          </h3>
          <p>
            {overview.badges.length} <span>/ {badgeThresholds.length}</span>
          </p>
        </div>
      </div>

      <div className="progress-dashboard">
        <div className="progress-column">
          <section className="period-panel activity-panel">
            <div className="period-heading">
              <div>
                <h3>Aktywność</h3>
                <p>{activePeriod.rangeLabel}</p>
              </div>
              <div className="period-tabs" aria-label="Okres">
                {periodTabs.map((period) => (
                  <button
                    type="button"
                    className={activePeriodKey === period.key ? 'active' : ''}
                    key={period.key}
                    aria-pressed={activePeriodKey === period.key}
                    onClick={() => setActivePeriodKey(period.key)}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            <dl className="activity-list">
              <div>
                <dt>Zadania wykonane</dt>
                <dd>{activePeriod.tasks}</dd>
              </div>
              <div>
                <dt>Punkty zdobyte</dt>
                <dd>{activePeriod.points}</dd>
              </div>
              <div>
                <dt>Nowe odznaki</dt>
                <dd>{activePeriod.badges.length}</dd>
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
            {badgeThresholds.map((badge) => {
              const isEarned = earnedBadgeIds.has(badge.id)

              return (
                <div className={isEarned ? 'driver-badge earned' : 'driver-badge'} key={badge.id}>
                  <img
                    src={badgeImages[badge.id]}
                    alt=""
                    className="badge-image"
                    aria-hidden="true"
                  />
                  <p>{badge.label}</p>
                </div>
              )
            })}

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



const formatSessionDate = (value: string) => {
  const date = new Date(value)

  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
