import { useRef, useState } from 'react'
import {
  parseProgressBackup,
  type ParsedProgressBackup,
  type StoredProgress,
} from '../../progress'

interface ProgressBackupControlsProps {
  progress: StoredProgress
  onExportProgress: () => void
  onImportProgress: (progress: StoredProgress) => void
}

export function ProgressBackupControls({
  progress,
  onExportProgress,
  onImportProgress,
}: ProgressBackupControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [pendingBackup, setPendingBackup] = useState<ParsedProgressBackup | null>(null)
  const [message, setMessage] = useState('')
  const hasCurrentProgress = progress.sessions.length > 0 || progress.totalPoints > 0

  const chooseImportFile = () => {
    setMessage('')
    inputRef.current?.click()
  }

  const readImportFile = async (file: File) => {
    try {
      const backup = parseProgressBackup(await file.text())
      setPendingBackup(backup)
      setMessage('')
    } catch {
      setPendingBackup(null)
      setMessage('Nie udało się odczytać pliku postępów.')
    }
  }

  const confirmImport = () => {
    if (!pendingBackup) {
      return
    }

    onImportProgress(pendingBackup.progress)
    setPendingBackup(null)
    setMessage('Postępy zostały zaimportowane.')
  }

  const cancelImport = () => {
    setPendingBackup(null)
    setMessage('')
  }

  return (
    <div className="backup-controls">
      <div className="quiet-actions">
        <button type="button" className="secondary-button" onClick={onExportProgress}>
          Eksportuj
        </button>
        <button type="button" className="secondary-button" onClick={chooseImportFile}>
          Importuj
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ''

          if (file) {
            void readImportFile(file)
          }
        }}
      />

      {pendingBackup && (
        <div className="import-confirmation" role="status">
          <p>
            Import zastąpi obecne postępy
            {hasCurrentProgress ? ' zapisane w przeglądarce' : ''}.
          </p>
          <dl>
            <div>
              <dt>Punkty</dt>
              <dd>{pendingBackup.progress.totalPoints}</dd>
            </div>
            <div>
              <dt>Sesje</dt>
              <dd>{pendingBackup.progress.sessions.length}</dd>
            </div>
            <div>
              <dt>Odznaki</dt>
              <dd>{pendingBackup.progress.badges.length}</dd>
            </div>
          </dl>
          <div className="quiet-actions">
            <button type="button" className="danger-button" onClick={confirmImport}>
              Importuj i zastąp
            </button>
            <button type="button" className="secondary-button" onClick={cancelImport}>
              Anuluj
            </button>
          </div>
        </div>
      )}

      {message && <p className="backup-message">{message}</p>}
    </div>
  )
}
