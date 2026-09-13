import finishFlagAsset from '../../assets/flaga_mety_asset.png'
import garageAsset from '../../assets/garaz_asset.png'
import progressCarAsset from '../../assets/progrss-car.png'
import raceTrackAsset from '../../assets/race-track.png'
import independentIcon from '../../assets/samodzielnie.png'
import withHelpIcon from '../../assets/z-pomoca.png'
import hardIcon from '../../assets/trudne.png'
import skipIcon from '../../assets/pominiete.png'
import type { ContentLevel, ContentStructure } from '../../content/contentTypes'
import type { ProgressBadge } from '../../progress'
import {
  getCurrentTask,
  getTaskRatingPoints,
  ratingOptions,
  type ReadingSession,
  type SessionRating,
} from '../../session'
import { SessionSummary } from './SessionSummary'
import { SessionTaskPanel } from './SessionTaskPanel'

interface SessionScreenProps {
  level?: ContentLevel
  structure?: ContentStructure
  session: ReadingSession
  earnedBadges: ProgressBadge[]
  onBack: () => void
  onRateTask: (rating: SessionRating) => void
  onReset: () => void
  onReturnHome: () => void
}

export function SessionScreen({
  level,
  structure,
  session,
  earnedBadges,
  onBack,
  onRateTask,
  onReset,
  onReturnHome,
}: SessionScreenProps) {
  if (session.status === 'completed') {
    return (
      <SessionSummary
        session={session}
        earnedBadges={earnedBadges}
        onBack={onBack}
        onReset={onReset}
        onReturnHome={onReturnHome}
      />
    )
  }

  const currentTask = getCurrentTask(session)
  const currentTaskNumber = session.answers.length + 1
  const roadSteps = Array.from({ length: session.tasks.length }, (_, index) => index + 1)
  const currentTaskKindLabel = currentTask?.title ?? 'Zadanie'
  const sessionContextLabel = session.module === 'reading'
    ? `Poziom ${level?.order ?? 1}`
    : `Struktura ${structure?.order ?? session.structureId.slice(-1)} · ${structure?.pattern ?? ''}`

  return (
    <section className="session-screen" aria-labelledby="session-title">
      <div className="session-area">
        <div className="session-topbar">
          <button type="button" className="secondary-button compact-action" onClick={onBack}>
            ← Powrót
          </button>
          <h2 id="session-title">
            {sessionContextLabel} <span>·</span> {currentTaskKindLabel}
          </h2>
          <button
            type="button"
            className="secondary-button compact-action"
            onClick={onReturnHome}
          >
            Zakończ sesję
          </button>
        </div>

        <div className="reading-road" aria-label="Postęp sesji">
          <div className="road-track" style={{ backgroundImage: `url(${raceTrackAsset})` }}>
            <div className="road-inner">
              {roadSteps.map((step) => {
                const fraction = (step - 1) / Math.max(session.tasks.length - 1, 1)
                const leftPercent = fraction * 100
                return (
                  <span
                    className={step <= currentTaskNumber ? 'road-step active' : 'road-step'}
                    key={step}
                    style={{ left: `${leftPercent}%` }}
                    aria-current={step === currentTaskNumber ? 'step' : undefined}
                  >
                    {step}
                  </span>
                )
              })}
              <span
                className="road-car"
                style={{
                  left: `${((currentTaskNumber - 1) / Math.max(session.tasks.length - 1, 1)) * 100}%`,
                }}
                aria-hidden="true"
              >
                <img src={progressCarAsset} alt="" />
              </span>
            </div>
          </div>
          <span className="finish-garage" aria-hidden="true">
            <img src={garageAsset} alt="" />
            <img src={finishFlagAsset} alt="" />
          </span>
        </div>

        <div className="session-workspace">
          <div className="session-task-column">
            {currentTask && (
              <SessionTaskPanel
                task={currentTask}
                taskCounterLabel={`Zadanie ${currentTaskNumber} z ${session.tasks.length}`}
              />
            )}
          </div>

          <aside className="parent-panel session-panel" aria-label="Panel rodzica">
            <h2>Panel rodzica</h2>
            <p className="panel-note">Oceń wykonanie zadania</p>
            <div className="rating-list">
              {ratingOptions.map((option) => (
                <button
                  type="button"
                  className="rating-button"
                  key={option.value}
                  onClick={() => onRateTask(option.value)}
                >
                  <span>
                    <img
                      src={ratingIcons[option.value]}
                      alt=""
                      className="rating-icon"
                      aria-hidden="true"
                    />
                    {option.label}
                  </span>
                  <span>
                    {currentTask
                      ? getTaskRatingPoints(currentTask, option.value)
                      : 0}{' '}
                    pkt
                  </span>
                </button>
              ))}
            </div>

            <div className="quiet-actions">
              <button type="button" className="text-button" onClick={onReset}>
                Resetuj bieżącą sesję
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

const ratingIcons: Record<SessionRating, string> = {
  independent: independentIcon,
  'with-help': withHelpIcon,
  hard: hardIcon,
  skip: skipIcon,
}
