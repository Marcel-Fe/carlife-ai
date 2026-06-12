import type { CostEntry, FuelEntry, MaintenanceEntry, Vehicle } from '../types'

// Single place that touches localStorage. Swapped for a cloud backend in phase 2.

export interface Db {
  vehicles: Vehicle[]
  fuelEntries: FuelEntry[]
  costEntries: CostEntry[]
  maintenanceEntries: MaintenanceEntry[]
  activeVehicleId: string | null
}

const STORAGE_KEY = 'carlife.v1'

const emptyDb: Db = {
  vehicles: [],
  fuelEntries: [],
  costEntries: [],
  maintenanceEntries: [],
  activeVehicleId: null,
}

export function loadDb(): Db {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(emptyDb)
    const parsed = JSON.parse(raw) as Partial<Db>
    return {
      vehicles: parsed.vehicles ?? [],
      fuelEntries: parsed.fuelEntries ?? [],
      costEntries: parsed.costEntries ?? [],
      maintenanceEntries: parsed.maintenanceEntries ?? [],
      activeVehicleId: parsed.activeVehicleId ?? null,
    }
  } catch {
    return structuredClone(emptyDb)
  }
}

export function saveDb(db: Db): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch (e) {
    // localStorage quota (~5 MB) exceeded — most likely too many photos.
    alert(
      'Speicher voll: Die Änderung konnte nicht gespeichert werden. ' +
        'Lösche alte Fotos oder lade vorher eine Sicherung herunter.',
    )
    throw e
  }
}

export function newId(): string {
  return crypto.randomUUID()
}

export function exportJson(): string {
  return JSON.stringify(loadDb(), null, 2)
}

/** Validates and imports a backup created by exportJson. Throws on invalid data. */
export function importJson(raw: string): void {
  const parsed = JSON.parse(raw) as Partial<Db>
  if (
    !parsed ||
    !Array.isArray(parsed.vehicles) ||
    !Array.isArray(parsed.fuelEntries) ||
    !Array.isArray(parsed.costEntries)
  ) {
    throw new Error('Keine gültige CarLife-Sicherungsdatei')
  }
  saveDb({
    vehicles: parsed.vehicles,
    fuelEntries: parsed.fuelEntries,
    costEntries: parsed.costEntries,
    maintenanceEntries: parsed.maintenanceEntries ?? [],
    activeVehicleId: parsed.activeVehicleId ?? parsed.vehicles[0]?.id ?? null,
  })
}
