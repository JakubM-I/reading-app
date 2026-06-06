import type { StoredProgress } from '../../progress'
import { ProgressBackupControls } from './ProgressBackupControls'
import logoHeaderAsset from '../../assets/logo-header.png'
import mainBackgroundAsset from '../../assets/main-background_3.png'
import mainLampAsset from '../../assets/main-lamp.png'

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
    <section className="start-screen" aria-labelledby="start-title">
      <header className="start-header">
        <div className="logo-group">
          <img src={logoHeaderAsset} alt="" className="logo-img" aria-hidden="true" />
          <h1 id="start-title">Czytanie krok po kroku</h1>
        </div>
        <nav className="start-nav" aria-label="Nawigacja startowa">
          <button type="button" className="secondary-button" onClick={onStart}>
            Poziomy
          </button>
          <button type="button" className="secondary-button" onClick={onProgress}>
            Postępy
          </button>
        </nav>
      </header>

      <div className="start-workspace">
        <img src={mainBackgroundAsset} alt="" className="start-bg-img" />
        <img src={mainLampAsset} alt="" className="main-lamp" aria-hidden="true" />

        <div className="garage-copy">
          <h2>
            Czytanie <span>krok po kroku</span>
          </h2>
          <p className="lead-text">
            Trenuj sylaby. Czytaj słowa. Zbieraj odznaki kierowcy.
          </p>

          <div className="primary-actions">
            <button type="button" className="primary-button icon-button" onClick={onStart}>
              <img src={logoHeaderAsset} alt="" className="button-icon-img" aria-hidden="true" />
              Rozpocznij sesję
            </button>
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
      </div>
    </section>
  )
}
