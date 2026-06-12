import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Battery,
  Camera,
  CircleDot,
  ClipboardCheck,
  Disc3,
  Droplets,
  Trash2,
  Wrench,
  X,
} from 'lucide-react'
import { useAppState } from '../state/AppState'
import type { MaintenanceType } from '../types'
import { fileToCompressedDataUrl } from '../lib/image'
import { formatDate, formatEuro, formatKm, todayIso } from '../lib/format'
import {
  Card,
  CardLabel,
  EmptyState,
  Field,
  PrimaryButton,
  Select,
  TextInput,
} from '../components/ui'
import { NoVehicleHint } from './Vehicle'

export const maintenanceMeta: Record<
  MaintenanceType,
  { label: string; icon: typeof Wrench }
> = {
  oil: { label: 'Ölwechsel', icon: Droplets },
  brakes: { label: 'Bremsen', icon: Disc3 },
  tires: { label: 'Reifen', icon: CircleDot },
  battery: { label: 'Batterie', icon: Battery },
  inspection: { label: 'Inspektion', icon: ClipboardCheck },
  other: { label: 'Sonstiges', icon: Wrench },
}

function AddMaintenanceForm() {
  const { activeVehicle, addMaintenanceEntry } = useAppState()
  const [date, setDate] = useState(todayIso())
  const [type, setType] = useState<MaintenanceType>('oil')
  const [km, setKm] = useState('')
  const [cost, setCost] = useState('')
  const [workshop, setWorkshop] = useState('')
  const [note, setNote] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files) return
    try {
      for (const file of Array.from(files).slice(0, 4 - photos.length)) {
        // Receipts stay readable at 1024px and keep localStorage usage low.
        const dataUrl = await fileToCompressedDataUrl(file, 1024, 0.75)
        setPhotos((p) => [...p, dataUrl])
      }
    } catch {
      alert('Ein Foto konnte nicht verarbeitet werden.')
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    addMaintenanceEntry({
      date,
      type,
      km: Number(km),
      cost: cost ? Number(cost) : 0,
      workshop: workshop.trim(),
      note: note.trim(),
      photos,
    })
    setKm('')
    setCost('')
    setWorkshop('')
    setNote('')
    setPhotos([])
    setDate(todayIso())
    setType('oil')
  }

  return (
    <Card>
      <CardLabel>Wartung erfassen</CardLabel>
      <form
        onSubmit={handleSubmit}
        className="mt-3 grid grid-cols-2 items-end gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >
        <Field label="Datum">
          <TextInput type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Art">
          <Select
            aria-label="Art"
            value={type}
            onChange={(e) => setType(e.target.value as MaintenanceType)}
          >
            {(Object.keys(maintenanceMeta) as MaintenanceType[]).map((t) => (
              <option key={t} value={t}>
                {maintenanceMeta[t].label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Kilometerstand">
          <TextInput
            type="number"
            required
            min={0}
            placeholder={activeVehicle ? String(activeVehicle.currentKm) : ''}
            value={km}
            onChange={(e) => setKm(e.target.value)}
          />
        </Field>
        <Field label="Kosten (€)">
          <TextInput
            type="number"
            min={0}
            step="0.01"
            placeholder="0,00"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </Field>
        <Field label="Werkstatt">
          <TextInput
            value={workshop}
            onChange={(e) => setWorkshop(e.target.value)}
            placeholder="z. B. ATU Berlin"
          />
        </Field>
        <Field label="Notiz">
          <TextInput
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="z. B. 5W-30, 4,5 l"
          />
        </Field>
        <div className="col-span-2 flex items-center gap-2 sm:col-span-3 lg:col-span-6">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={photos.length >= 4}
            className="flex items-center gap-2 rounded-xl border border-edge px-3.5 py-2 text-xs font-semibold text-ink-soft transition hover:border-accent hover:text-ink disabled:opacity-40"
          >
            <Camera size={14} className="text-accent" />
            Rechnung/Foto ({photos.length}/4)
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              void handleFiles(e.target.files)
              e.target.value = ''
            }}
          />
          {photos.map((p, i) => (
            <div key={i} className="relative">
              <img src={p} alt={`Foto ${i + 1}`} className="h-10 w-10 rounded-lg object-cover" />
              <button
                type="button"
                aria-label="Foto entfernen"
                onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))}
                className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-bad text-night"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          <div className="ml-auto">
            <PrimaryButton type="submit">Speichern</PrimaryButton>
          </div>
        </div>
      </form>
    </Card>
  )
}

export function MaintenancePage() {
  const { activeVehicle, maintenanceEntries, deleteMaintenanceEntry } = useAppState()
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (!activeVehicle) return <NoVehicleHint title="Noch kein Fahrzeug angelegt" />

  return (
    <div className="rise-in flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Wartungsmanager</h1>

      <AddMaintenanceForm />

      {maintenanceEntries.length === 0 ? (
        <EmptyState
          icon={<Wrench size={40} />}
          title="Noch keine Wartungen erfasst"
          text="Dokumentiere Ölwechsel, Bremsen, Reifen und Inspektionen mit Rechnungsfotos — deine lückenlose Werkstattakte steigert auch den Wiederverkaufswert."
        />
      ) : (
        <Card>
          <CardLabel>Werkstattakte ({maintenanceEntries.length})</CardLabel>
          <ul className="mt-2 divide-y divide-edge">
            {maintenanceEntries.map((entry) => {
              const meta = maintenanceMeta[entry.type]
              const Icon = meta.icon
              return (
                <li key={entry.id} className="flex items-start gap-3 py-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-dim/40 text-accent">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">
                      {meta.label}
                      {entry.workshop && (
                        <span className="ml-2 font-normal text-ink-soft">{entry.workshop}</span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-ink-soft">
                      {formatDate(entry.date)} · {formatKm(entry.km)}
                      {entry.note && <span> · {entry.note}</span>}
                    </div>
                    {entry.photos.length > 0 && (
                      <div className="mt-2 flex gap-1.5">
                        {entry.photos.map((p, i) => (
                          <button key={i} type="button" onClick={() => setLightbox(p)}>
                            <img
                              src={p}
                              alt={`Beleg ${i + 1}`}
                              className="h-12 w-12 rounded-lg border border-edge object-cover transition hover:border-accent"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-bold">
                    {entry.cost > 0 ? formatEuro(entry.cost) : '—'}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Diesen Wartungseintrag löschen?')) {
                        deleteMaintenanceEntry(entry.id)
                      }
                    }}
                    className="p-1.5 text-ink-soft/50 transition hover:text-bad"
                    aria-label="Wartungseintrag löschen"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>
      )}

      {lightbox && (
        <button
          type="button"
          aria-label="Foto schließen"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/90 p-4 backdrop-blur"
        >
          <img src={lightbox} alt="Beleg" className="max-h-full max-w-full rounded-2xl" />
        </button>
      )}
    </div>
  )
}
