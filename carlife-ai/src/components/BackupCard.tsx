import { useRef } from 'react'
import { Download, Upload } from 'lucide-react'
import { exportJson, importJson } from '../storage/store'
import { todayIso } from '../lib/format'
import { Card, CardLabel, GhostButton } from './ui'

export function BackupCard() {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `carlife-backup-${todayIso()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport(file: File | undefined) {
    if (!file) return
    const confirmed = window.confirm(
      'Sicherung wiederherstellen? Alle aktuellen Daten in dieser App werden dabei ersetzt.',
    )
    if (!confirmed) return
    try {
      importJson(await file.text())
      window.location.reload()
    } catch {
      alert('Diese Datei ist keine gültige CarLife-Sicherung.')
    }
  }

  return (
    <Card>
      <CardLabel>Datensicherung</CardLabel>
      <p className="mt-2 text-xs text-ink-soft">
        Deine Daten liegen nur auf diesem Gerät. Lade regelmäßig eine Sicherung herunter — damit
        kannst du sie auf einem neuen Gerät oder nach einem Browser-Reset wiederherstellen.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <GhostButton onClick={handleExport}>
          <span className="flex items-center gap-2">
            <Download size={14} /> Sicherung herunterladen
          </span>
        </GhostButton>
        <GhostButton onClick={() => fileRef.current?.click()}>
          <span className="flex items-center gap-2">
            <Upload size={14} /> Sicherung wiederherstellen
          </span>
        </GhostButton>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            void handleImport(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </div>
    </Card>
  )
}
