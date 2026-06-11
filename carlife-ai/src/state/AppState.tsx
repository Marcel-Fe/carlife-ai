/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CostEntry, FuelEntry, Vehicle } from '../types'
import { loadDb, newId, saveDb } from '../storage/store'
import type { Db } from '../storage/store'

interface AppState {
  vehicles: Vehicle[]
  activeVehicle: Vehicle | null
  fuelEntries: FuelEntry[] // entries of the active vehicle, newest first
  costEntries: CostEntry[] // entries of the active vehicle
  setActiveVehicle: (id: string) => void
  addVehicle: (data: Omit<Vehicle, 'id' | 'createdAt'>) => void
  updateVehicle: (id: string, data: Partial<Vehicle>) => void
  addFuelEntry: (data: Omit<FuelEntry, 'id' | 'vehicleId'>) => void
  deleteFuelEntry: (id: string) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Db>(loadDb)

  const persist = useCallback((next: Db) => {
    setDb(next)
    saveDb(next)
  }, [])

  const setActiveVehicle = useCallback(
    (id: string) => persist({ ...db, activeVehicleId: id }),
    [db, persist],
  )

  const addVehicle = useCallback(
    (data: Omit<Vehicle, 'id' | 'createdAt'>) => {
      const vehicle: Vehicle = { ...data, id: newId(), createdAt: new Date().toISOString() }
      persist({
        ...db,
        vehicles: [...db.vehicles, vehicle],
        activeVehicleId: vehicle.id,
      })
    },
    [db, persist],
  )

  const updateVehicle = useCallback(
    (id: string, data: Partial<Vehicle>) => {
      persist({
        ...db,
        vehicles: db.vehicles.map((v) => (v.id === id ? { ...v, ...data } : v)),
      })
    },
    [db, persist],
  )

  const addFuelEntry = useCallback(
    (data: Omit<FuelEntry, 'id' | 'vehicleId'>) => {
      if (!db.activeVehicleId) return
      const entry: FuelEntry = { ...data, id: newId(), vehicleId: db.activeVehicleId }
      // Every fuel entry automatically becomes a cost entry (category "fuel").
      const cost: CostEntry = {
        id: newId(),
        vehicleId: entry.vehicleId,
        date: entry.date,
        category: 'fuel',
        amount: entry.totalPrice,
        note: `Tanken ${entry.liters.toLocaleString('de-DE')} l`,
        refId: entry.id,
      }
      const vehicles = db.vehicles.map((v) =>
        v.id === entry.vehicleId && entry.km > v.currentKm ? { ...v, currentKm: entry.km } : v,
      )
      persist({
        ...db,
        vehicles,
        fuelEntries: [...db.fuelEntries, entry],
        costEntries: [...db.costEntries, cost],
      })
    },
    [db, persist],
  )

  const deleteFuelEntry = useCallback(
    (id: string) => {
      persist({
        ...db,
        fuelEntries: db.fuelEntries.filter((e) => e.id !== id),
        costEntries: db.costEntries.filter((c) => c.refId !== id),
      })
    },
    [db, persist],
  )

  const value = useMemo<AppState>(() => {
    const activeVehicle = db.vehicles.find((v) => v.id === db.activeVehicleId) ?? null
    const fuelEntries = db.fuelEntries
      .filter((e) => e.vehicleId === activeVehicle?.id)
      .sort((a, b) => b.km - a.km)
    const costEntries = db.costEntries.filter((c) => c.vehicleId === activeVehicle?.id)
    return {
      vehicles: db.vehicles,
      activeVehicle,
      fuelEntries,
      costEntries,
      setActiveVehicle,
      addVehicle,
      updateVehicle,
      addFuelEntry,
      deleteFuelEntry,
    }
  }, [db, setActiveVehicle, addVehicle, updateVehicle, addFuelEntry, deleteFuelEntry])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAppState(): AppState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider')
  return ctx
}
