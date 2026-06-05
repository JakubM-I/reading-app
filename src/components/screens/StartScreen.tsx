import type { StoredProgress } from '../../progress'
import { ProgressBackupControls } from './ProgressBackupControls'

export interface StartScreenSummary {
  levels: number
  words: number
  sentences: number
}

interface StartScreenProps {
  summary: StartScreenSummary
  progress: StoredProgress
  onExportProgress: () => void
  onImportProgress: (progress: StoredProgress) => void
  onStart: () => void
  onProgress: () => void
  onReset: () => void
}

export function StartScreen({
  summary,
  progress,
  onExportProgress,
  onImportProgress,
  onStart,
  onProgress,
  onReset,
}: StartScreenProps) {
  return (
    <section className="screen-grid" aria-labelledby="start-title">
      <div className="screen-main garage-start">
        <div className="garage-copy">
          <p className="eyebrow">Czytanie krok po kroku</p>
          <h2 id="start-title">
            Czytanie <span>krok po kroku</span>
          </h2>
          <p className="lead-text">
            Trenuj sylaby. Czytaj słowa. Zbieraj odznaki kierowcy.
          </p>

          <div className="primary-actions">
            <button type="button" className="primary-button icon-button" onClick={onStart}>
              <span aria-hidden="true">◉</span>
              Rozpocznij sesję
            </button>
            <button type="button" className="secondary-button" onClick={onProgress}>
              Postępy
            </button>
          </div>
        </div>

        <div className="garage-scene" aria-hidden="true">
          <div className="garage-window" />
          <div className="garage-lamp" />
          <div className="garage-shelf" />
          <div className="garage-cabinet" />
          <div className="garage-tires" />
          <div className="garage-cone" />
          <div className="garage-track" />
          <div className="garage-car">
            <span />
          </div>
        </div>
      </div>

      <aside className="parent-panel" aria-label="Panel rodzica">
        <h2>Panel rodzica</h2>
        <dl className="summary-grid parent-stats">
          <div>
            <dt><span aria-hidden="true">★</span> Punkty</dt>
            <dd>{progress.totalPoints}</dd>
          </div>
          <div>
            <dt><span aria-hidden="true">⚑</span> Sesje</dt>
            <dd>{progress.sessions.length}</dd>
          </div>
          <div>
            <dt><span aria-hidden="true">⬟</span> Odznaki</dt>
            <dd>{progress.badges.length}</dd>
          </div>
          <div>
            <dt>Poziomy</dt>
            <dd>{summary.levels}</dd>
          </div>
        </dl>
        <ProgressBackupControls
          progress={progress}
          onExportProgress={onExportProgress}
          onImportProgress={onImportProgress}
        />

        <div className="quiet-actions">
          <button type="button" className="text-button settings-button" onClick={onReset}>
            <span aria-hidden="true">⚙</span>
            Ustawienia
          </button>
        </div>
      </aside>
    </section>
  )
}
