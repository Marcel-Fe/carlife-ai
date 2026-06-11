import type { CostEntry, FuelEntry, Vehicle } from '../types'

// Single place that touches localStorage. Swapped for a cloud backend in phase 2.

export interface Db {
  vehicles: Vehicle[]
  fuelEntries: FuelEntry[]
  costEntries: CostEntry[]
  activeVehicleId: string | null
}

const STORAGE_KEY = 'carlife.v1'

const emptyDb: Db = {
  vehicles: [],
  fuelEntries: [],
  costEntries: [],
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
      activeVehicleId: parsed.activeVehicleId ?? null,
    }
  } catch {
    return structuredClone(emptyDb)
  }
}

export function saveDb(db: Db): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

export function newId(): string {
  return crypto.randomUUID()
}
