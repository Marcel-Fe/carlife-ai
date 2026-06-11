import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Fuel, Trash2 } from 'lucide-react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAppState } from '../state/AppState'
import {
  averageConsumption,
  consumptionSeries,
  costPerKm,
  costsInMonth,
  costsInYear,
} from '../lib/calculations'
import { formatDate, formatEuro, formatKm, formatNumber, todayIso } from '../lib/format'
import {
  BigValue,
  Card,
  CardLabel,
  EmptyState,
  Field,
  PrimaryButton,
  TextInput,
} from '../components/ui'
import { NoVehicleHint } from './Vehicle'

function AddFuelForm() {
  const { activeVehicle, addFuelEntry } = useAppState()
  const [date, setDate] = useState(todayIso())
  const [liters, setLiters] = useState('')
  const [pricePerLiter, setPricePerLiter] = useState('')
  const [km, setKm] = useState('')
  const [fullTank, setFullTank] = useState(true)

  const total =
    liters && pricePerLiter ? Number(liters) * Number(pricePerLiter) : null

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!total) return
    addFuelEntry({
      date,
      liters: Number(liters),
      pricePerLiter: Number(pricePerLiter),
      totalPrice: Math.round(total * 100) / 100,
      km: Number(km),
      fullTank,
    })
    setLiters('')
    setPricePerLiter('')
    setKm('')
    setFullTank(true)
    setDate(todayIso())
  }

  return (
    <Card>
      <CardLabel>Tankvorgang erfassen</CardLabel>
      <form
        onSubmit={handleSubmit}
        className="mt-3 grid grid-cols-2 items-end gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >
        <Field label="Datum">
          <TextInput type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Liter">
          <TextInput
            type="number"
            required
            min={0.1}
            step="0.01"
            placeholder="42,5"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
          />
        </Field>
        <Field label="Preis / Liter (€)">
          <TextInput
            type="number"
            required
            min={0.01}
            step="0.001"
            placeholder="1,799"
            value={pricePerLiter}
            onChange={(e) => setPricePerLiter(e.target.value)}
          />
        </Field>
        <Field label="Kilometerstand">
          <TextInput
            type="number"
            required
            min={activeVehicle ? 1 : 0}
            placeholder={activeVehicle ? String(activeVehicle.currentKm) : ''}
            value={km}
            onChange={(e) => setKm(e.target.value)}
          />
        </Field>
        <label className="flex items-center gap-2 py-2.5 text-sm font-semibold text-ink-soft">
          <input
            type="checkbox"
            checked={fullTank}
            onChange={(e) => setFullTank(e.target.checked)}
            className="h-4 w-4 accent-(--color-accent)"
          />
          Volltank
        </label>
        <div className="flex flex-col items-stretch gap-1">
          {total !== null && (
            <span className="text-center text-xs text-ink-soft">= {formatEuro(total)}</span>
          )}
          <PrimaryButton type="submit">Speichern</PrimaryButton>
        </div>
      </form>
    </Card>
  )
}

export function FuelLogPage() {
  const { activeVehicle, fuelEntries, costEntries, deleteFuelEntry } = useAppState()

  const stats = useMemo(() => {
    const now = new Date()
    return {
      avg: averageConsumption(fuelEntries),
      series: consumptionSeries(fuelEntries),
      perKm: costPerKm(
        costEntries.filter((c) => c.category === 'fuel'),
        fuelEntries,
      ),
      month: costsInMonth(
        costEntries.filter((c) => c.category === 'fuel'),
        now.getFullYear(),
        now.getMonth(),
      ),
      year: costsInYear(
        costEntries.filter((c) => c.category === 'fuel'),
        now.getFullYear(),
      ),
    }
  }, [fuelEntries, costEntries])

  if (!activeVehicle) return <NoVehicleHint title="Noch kein Fahrzeug angelegt" />

  return (
    <div className="rise-in flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Tankbuch</h1>

      <AddFuelForm />

      {fuelEntries.length === 0 ? (
        <EmptyState
          icon={<Fuel size={40} />}
          title="Noch keine Tankvorgänge"
          text="Erfasse oben deinen ersten Tankvorgang. Ab der zweiten Volltankung berechnet CarLife AI automatisch deinen Verbrauch."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Card>
              <CardLabel>Ø Verbrauch</CardLabel>
              <BigValue>
                {stats.avg !== null ? `${formatNumber(stats.avg)} l/100km` : '—'}
              </BigValue>
            </Card>
            <Card>
              <CardLabel>Kosten / km</CardLabel>
              <BigValue>
                {stats.perKm !== null ? `${formatNumber(stats.perKm * 100, 2)} ct` : '—'}
              </BigValue>
            </Card>
            <Card>
              <CardLabel>Tankkosten Monat</CardLabel>
              <BigValue>{formatEuro(stats.month)}</BigValue>
            </Card>
            <Card>
              <CardLabel>Tankkosten Jahr</CardLabel>
              <BigValue>{formatEuro(stats.year)}</BigValue>
            </Card>
          </div>

          {stats.series.length >= 2 && (
            <Card>
              <CardLabel>Verbrauchsverlauf (l/100 km)</CardLabel>
              <div className="mt-3 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.series} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="consumption" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d: string) => formatDate(d).slice(0, 6)}
                      stroke="#8b94a7"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#8b94a7"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#161a22',
                        border: '1px solid #232936',
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      labelFormatter={(d) => formatDate(String(d))}
                      formatter={(value) => [
                        `${formatNumber(Number(value))} l/100km`,
                        'Verbrauch',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="litersPer100Km"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      fill="url(#consumption)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          <Card>
            <CardLabel>Alle Tankvorgänge</CardLabel>
            <ul className="mt-2 divide-y divide-edge">
              {fuelEntries.map((entry) => (
                <li key={entry.id} className="flex items-center gap-3 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-dim/40 text-accent">
                    <Fuel size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">
                      {formatNumber(entry.liters, 2)} l ·{' '}
                      {formatNumber(entry.pricePerLiter, 3)} €/l
                      {entry.fullTank && (
                        <span className="ml-2 rounded-md bg-accent-dim/40 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                          VOLL
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-ink-soft">
                      {formatDate(entry.date)} · {formatKm(entry.km)}
                    </div>
                  </div>
                  <div className="text-sm font-bold">{formatEuro(entry.totalPrice)}</div>
                  <button
                    type="button"
                    onClick={() => deleteFuelEntry(entry.id)}
                    className="p-1.5 text-ink-soft/50 transition hover:text-bad"
                    aria-label="Tankvorgang löschen"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  )
}
