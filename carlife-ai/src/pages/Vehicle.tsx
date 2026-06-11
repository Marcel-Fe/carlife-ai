import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Car, Camera, Pencil, Plus } from 'lucide-react'
import { useAppState } from '../state/AppState'
import type { FuelType, Vehicle } from '../types'
import { fileToCompressedDataUrl } from '../lib/image'
import { formatDate, formatEuro, formatKm } from '../lib/format'
import {
  Card,
  CardLabel,
  EmptyState,
  Field,
  GhostButton,
  PrimaryButton,
  Select,
  TextInput,
} from '../components/ui'

const fuelTypeLabels: Record<FuelType, string> = {
  benzin: 'Benzin',
  diesel: 'Diesel',
  elektro: 'Elektro',
  hybrid: 'Hybrid',
  lpg: 'LPG / Autogas',
}

interface FormData {
  make: string
  model: string
  year: string
  engine: string
  fuelType: FuelType
  licensePlate: string
  purchasePrice: string
  purchaseDate: string
  currentKm: string
}

function toFormData(v: Vehicle | null): FormData {
  return {
    make: v?.make ?? '',
    model: v?.model ?? '',
    year: v ? String(v.year) : '',
    engine: v?.engine ?? '',
    fuelType: v?.fuelType ?? 'benzin',
    licensePlate: v?.licensePlate ?? '',
    purchasePrice: v?.purchasePrice != null ? String(v.purchasePrice) : '',
    purchaseDate: v?.purchaseDate ?? '',
    currentKm: v ? String(v.currentKm) : '',
  }
}

function VehicleForm({
  vehicle,
  onDone,
}: {
  vehicle: Vehicle | null
  onDone: () => void
}) {
  const { addVehicle, updateVehicle } = useAppState()
  const [form, setForm] = useState<FormData>(() => toFormData(vehicle))

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const data = {
      make: form.make.trim(),
      model: form.model.trim(),
      year: Number(form.year) || new Date().getFullYear(),
      engine: form.engine.trim(),
      fuelType: form.fuelType,
      licensePlate: form.licensePlate.trim().toUpperCase(),
      purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : null,
      purchaseDate: form.purchaseDate || null,
      currentKm: Number(form.currentKm) || 0,
    }
    if (vehicle) {
      updateVehicle(vehicle.id, data)
    } else {
      addVehicle({ ...data, imageDataUrl: null })
    }
    onDone()
  }

  return (
    <Card className="rise-in">
      <h2 className="mb-4 text-lg font-bold">
        {vehicle ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug anlegen'}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Marke *">
          <TextInput
            required
            value={form.make}
            onChange={(e) => set('make', e.target.value)}
            placeholder="z. B. VW"
          />
        </Field>
        <Field label="Modell *">
          <TextInput
            required
            value={form.model}
            onChange={(e) => set('model', e.target.value)}
            placeholder="z. B. Golf GTI"
          />
        </Field>
        <Field label="Baujahr">
          <TextInput
            type="number"
            min={1950}
            max={2100}
            value={form.year}
            onChange={(e) => set('year', e.target.value)}
            placeholder="z. B. 2019"
          />
        </Field>
        <Field label="Motor">
          <TextInput
            value={form.engine}
            onChange={(e) => set('engine', e.target.value)}
            placeholder="z. B. 2.0 TSI, 245 PS"
          />
        </Field>
        <Field label="Kraftstoff">
          <Select value={form.fuelType} onChange={(e) => set('fuelType', e.target.value as FuelType)}>
            {Object.entries(fuelTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Kennzeichen">
          <TextInput
            value={form.licensePlate}
            onChange={(e) => set('licensePlate', e.target.value)}
            placeholder="z. B. B-AB 1234"
          />
        </Field>
        <Field label="Kilometerstand *">
          <TextInput
            required
            type="number"
            min={0}
            value={form.currentKm}
            onChange={(e) => set('currentKm', e.target.value)}
            placeholder="z. B. 64500"
          />
        </Field>
        <Field label="Kaufpreis (€)">
          <TextInput
            type="number"
            min={0}
            step="0.01"
            value={form.purchasePrice}
            onChange={(e) => set('purchasePrice', e.target.value)}
            placeholder="z. B. 24900"
          />
        </Field>
        <Field label="Kaufdatum">
          <TextInput
            type="date"
            value={form.purchaseDate}
            onChange={(e) => set('purchaseDate', e.target.value)}
          />
        </Field>
        <div className="flex items-end justify-end gap-2 sm:col-span-2">
          {vehicle && <GhostButton onClick={onDone}>Abbrechen</GhostButton>}
          <PrimaryButton type="submit">
            {vehicle ? 'Speichern' : 'Fahrzeug anlegen'}
          </PrimaryButton>
        </div>
      </form>
    </Card>
  )
}

function PhotoUpload({ vehicle }: { vehicle: Vehicle }) {
  const { updateVehicle } = useAppState()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    try {
      const dataUrl = await fileToCompressedDataUrl(file)
      updateVehicle(vehicle.id, { imageDataUrl: dataUrl })
    } catch {
      alert('Das Bild konnte nicht verarbeitet werden.')
    }
  }

  return (
    <div className="relative h-48 overflow-hidden rounded-2xl border border-edge bg-card sm:h-64">
      {vehicle.imageDataUrl ? (
        <img
          src={vehicle.imageDataUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-ink-soft">
          <Car size={40} className="text-accent" />
          <span className="text-sm">Noch kein Fahrzeugfoto</span>
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute right-3 bottom-3 flex items-center gap-2 rounded-xl bg-night/80 px-3.5 py-2 text-xs font-bold backdrop-blur transition hover:bg-night"
      >
        <Camera size={15} className="text-accent" />
        Foto {vehicle.imageDataUrl ? 'ändern' : 'hinzufügen'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}

function LicensePlate({ plate }: { plate: string }) {
  if (!plate) return null
  return (
    <span className="inline-flex items-center overflow-hidden rounded-md border border-ink/30 bg-white font-bold text-black">
      <span className="flex h-full items-center self-stretch bg-blue-700 px-1.5 text-[10px] text-white">
        D
      </span>
      <span className="px-2.5 py-0.5 text-sm tracking-widest">{plate}</span>
    </span>
  )
}

export function VehiclePage() {
  const { activeVehicle } = useAppState()
  const [editing, setEditing] = useState(false)
  const [creating, setCreating] = useState(false)

  if (!activeVehicle || creating) {
    return (
      <div className="mx-auto max-w-2xl">
        {!activeVehicle && (
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold">Willkommen bei CarLife AI</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Lege dein Fahrzeug an, um deine digitale Fahrzeugzentrale zu starten.
            </p>
          </div>
        )}
        <VehicleForm vehicle={null} onDone={() => setCreating(false)} />
      </div>
    )
  }

  if (editing) {
    return (
      <div className="mx-auto max-w-2xl">
        <VehicleForm vehicle={activeVehicle} onDone={() => setEditing(false)} />
      </div>
    )
  }

  const v = activeVehicle
  const facts: [string, string][] = [
    ['Baujahr', String(v.year)],
    ['Motor', v.engine || '—'],
    ['Kraftstoff', fuelTypeLabels[v.fuelType]],
    ['Kilometerstand', formatKm(v.currentKm)],
    ['Kaufpreis', v.purchasePrice != null ? formatEuro(v.purchasePrice) : '—'],
    ['Kaufdatum', v.purchaseDate ? formatDate(v.purchaseDate) : '—'],
  ]

  return (
    <div className="rise-in mx-auto flex max-w-2xl flex-col gap-4">
      <PhotoUpload vehicle={v} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {v.make} {v.model}
          </h1>
          <div className="mt-1.5">
            <LicensePlate plate={v.licensePlate} />
          </div>
        </div>
        <GhostButton onClick={() => setEditing(true)}>
          <span className="flex items-center gap-2">
            <Pencil size={14} /> Bearbeiten
          </span>
        </GhostButton>
      </div>

      <Card>
        <CardLabel>Fahrzeugdaten</CardLabel>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-ink-soft">{label}</dt>
              <dd className="text-sm font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 text-sm font-semibold text-ink-soft transition hover:text-accent"
        >
          <Plus size={16} /> Weiteres Fahrzeug anlegen
        </button>
      </div>
    </div>
  )
}

export function NoVehicleHint({ title }: { title: string }) {
  return (
    <EmptyState
      icon={<Car size={40} />}
      title={title}
      text="Lege zuerst dein Fahrzeug in der Fahrzeugakte an — danach stehen hier alle Funktionen bereit."
    />
  )
}
