export type FuelType = 'benzin' | 'diesel' | 'elektro' | 'hybrid' | 'lpg'

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  engine: string
  fuelType: FuelType
  licensePlate: string
  purchasePrice: number | null
  purchaseDate: string | null // ISO date
  currentKm: number
  imageDataUrl: string | null
  createdAt: string // ISO datetime
}

export interface FuelEntry {
  id: string
  vehicleId: string
  date: string // ISO date
  liters: number
  pricePerLiter: number
  totalPrice: number
  km: number
  fullTank: boolean
}

export type CostCategory = 'fuel' | 'insurance' | 'tax' | 'repair' | 'maintenance' | 'other'

export interface CostEntry {
  id: string
  vehicleId: string
  date: string // ISO date
  category: CostCategory
  amount: number
  note: string
  refId?: string // links auto-generated entries to their source (e.g. FuelEntry)
}

export type MaintenanceType =
  | 'oil'
  | 'brakes'
  | 'tires'
  | 'battery'
  | 'inspection'
  | 'other'

export interface MaintenanceEntry {
  id: string
  vehicleId: string
  date: string
  type: MaintenanceType
  km: number
  cost: number
  workshop: string
  note: string
  photos: string[] // compressed JPEG data URLs (receipts, work photos)
}

// Phase 2
export interface Reminder {
  id: string
  vehicleId: string
  type: string
  dueDate: string | null
  dueKm: number | null
  note: string
  done: boolean
}

export interface ConsumptionPoint {
  date: string
  km: number
  litersPer100Km: number
}
