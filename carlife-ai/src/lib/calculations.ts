import type { ConsumptionPoint, CostEntry, FuelEntry, Vehicle } from '../types'

// Pure functions only — derived values are computed, never stored.

function sortedByKm(entries: FuelEntry[]): FuelEntry[] {
  return [...entries].sort((a, b) => a.km - b.km)
}

/**
 * Consumption between full-tank fills: liters of every fill after the previous
 * full tank up to and including the current full tank, divided by km distance.
 */
export function consumptionSeries(entries: FuelEntry[]): ConsumptionPoint[] {
  const sorted = sortedByKm(entries)
  const points: ConsumptionPoint[] = []
  let lastFullIndex = -1

  sorted.forEach((entry, i) => {
    if (!entry.fullTank) return
    if (lastFullIndex >= 0) {
      const distance = entry.km - sorted[lastFullIndex].km
      const liters = sorted
        .slice(lastFullIndex + 1, i + 1)
        .reduce((sum, e) => sum + e.liters, 0)
      if (distance > 0 && liters > 0) {
        points.push({
          date: entry.date,
          km: entry.km,
          litersPer100Km: (liters / distance) * 100,
        })
      }
    }
    lastFullIndex = i
  })

  return points
}

export function averageConsumption(entries: FuelEntry[]): number | null {
  const points = consumptionSeries(entries)
  if (points.length === 0) return null
  return points.reduce((sum, p) => sum + p.litersPer100Km, 0) / points.length
}

/** Total cost divided by km driven within the fuel log's km range. */
export function costPerKm(costs: CostEntry[], fuel: FuelEntry[]): number | null {
  if (fuel.length < 2) return null
  const sorted = sortedByKm(fuel)
  const distance = sorted[sorted.length - 1].km - sorted[0].km
  if (distance <= 0) return null
  const total = costs.reduce((sum, c) => sum + c.amount, 0)
  return total / distance
}

export function costsInMonth(costs: CostEntry[], year: number, month: number): number {
  return costs
    .filter((c) => {
      const d = new Date(c.date)
      return d.getFullYear() === year && d.getMonth() === month
    })
    .reduce((sum, c) => sum + c.amount, 0)
}

export function costsInYear(costs: CostEntry[], year: number): number {
  return costs
    .filter((c) => new Date(c.date).getFullYear() === year)
    .reduce((sum, c) => sum + c.amount, 0)
}

/** Monthly totals for the last `count` months, oldest first. */
export function monthlyCostSeries(
  costs: CostEntry[],
  count: number,
): { label: string; amount: number }[] {
  const now = new Date()
  const result: { label: string; amount: number }[] = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push({
      label: d.toLocaleDateString('de-DE', { month: 'short' }),
      amount: costsInMonth(costs, d.getFullYear(), d.getMonth()),
    })
  }
  return result
}

export function costsByCategory(costs: CostEntry[]): { category: string; amount: number }[] {
  const sums = new Map<string, number>()
  for (const c of costs) {
    sums.set(c.category, (sums.get(c.category) ?? 0) + c.amount)
  }
  return [...sums.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

/**
 * Rule-based AutoScore (phase 1): rewards complete vehicle data and an
 * actively maintained fuel log. Becomes AI-assisted in later phases.
 */
export function autoScore(vehicle: Vehicle, fuel: FuelEntry[]): number {
  let score = 0

  // Data completeness: up to 50 points
  const fields = [
    vehicle.make,
    vehicle.model,
    vehicle.engine,
    vehicle.licensePlate,
    vehicle.year > 1900,
    vehicle.currentKm > 0,
    vehicle.purchasePrice !== null,
    vehicle.purchaseDate,
    vehicle.imageDataUrl,
  ]
  const filled = fields.filter(Boolean).length
  score += Math.round((filled / fields.length) * 50)

  // Fuel log activity: up to 30 points
  score += Math.min(fuel.length * 6, 30)

  // Recency: 20 points if last entry is younger than 45 days
  if (fuel.length > 0) {
    const newest = Math.max(...fuel.map((e) => new Date(e.date).getTime()))
    const ageDays = (Date.now() - newest) / 86_400_000
    if (ageDays <= 45) score += 20
    else if (ageDays <= 90) score += 10
  }

  return Math.min(score, 100)
}
