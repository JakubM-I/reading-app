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
      <div className="screen-main">
        <p className="eyebrow">Start</p>
        <h2 id="start-title">Spokojna sesja czytania</h2>
        <p className="lead-text">
          Wybierz poziom, zobacz opis dla rodzica i przejdź do pustego ekranu
          sesji.
        </p>

        <div className="primary-actions">
          <button type="button" className="primary-button" onClick={onStart}>
            Rozpocznij sesję
          </button>
          <button type="button" className="secondary-button" onClick={onProgress}>
            Panel postępów
          </button>
        </div>
      </div>

      <aside className="parent-panel" aria-label="Panel rodzica">
        <h2>Panel rodzica</h2>
        <dl className="summary-grid">
          <div>
            <dt>Punkty łączne</dt>
            <dd>{progress.totalPoints}</dd>
          </div>
          <div>
            <dt>Sesje</dt>
            <dd>{progress.sessions.length}</dd>
          </div>
          <div>
            <dt>Odznaki</dt>
            <dd>{progress.badges.length}</dd>
          </div>
          <div>
            <dt>Poziomy</dt>
            <dd>{summary.levels}</dd>
          </div>
        </dl>
        <p className="panel-note">
          Postępy zapisują się lokalnie w tej przeglądarce.
        </p>

        <ProgressBackupControls
          progress={progress}
          onExportProgress={onExportProgress}
          onImportProgress={onImportProgress}
        />

        <div className="quiet-actions">
          <button type="button" className="text-button" onClick={onReset}>
            Reset danych
          </button>
        </div>
      </aside>
    </section>
  )
}
