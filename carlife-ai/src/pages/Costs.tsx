import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Fuel, LineChart, Trash2, Wrench } from 'lucide-react'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAppState } from '../state/AppState'
import type { CostCategory } from '../types'
import {
  costsByCategory,
  costsInMonth,
  costsInYear,
  monthlyCostSeries,
} from '../lib/calculations'
import { formatDate, formatEuro, todayIso } from '../lib/format'
import {
  BigValue,
  Card,
  CardLabel,
  EmptyState,
  Field,
  PrimaryButton,
  Select,
  TextInput,
} from '../components/ui'
import { NoVehicleHint } from './Vehicle'

export const categoryMeta: Record<CostCategory, { label: string; color: string }> = {
  fuel: { label: 'Tanken', color: '#22d3ee' },
  insurance: { label: 'Versicherung', color: '#818cf8' },
  tax: { label: 'Steuer', color: '#fbbf24' },
  repair: { label: 'Reparatur', color: '#f87171' },
  maintenance: { label: 'Wartung', color: '#34d399' },
  other: { label: 'Sonstiges', color: '#8b94a7' },
}

// Fuel costs are created automatically from the fuel log.
const manualCategories = (Object.keys(categoryMeta) as CostCategory[]).filter(
  (c) => c !== 'fuel',
)

function AddCostForm() {
  const { addCostEntry } = useAppState()
  const [date, setDate] = useState(todayIso())
  const [category, setCategory] = useState<CostCategory>('insurance')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    addCostEntry({ date, category, amount: Number(amount), note: note.trim() })
    setAmount('')
    setNote('')
    setDate(todayIso())
  }

  return (
    <Card>
      <CardLabel>Kosten erfassen</CardLabel>
      <p className="mt-1 text-xs text-ink-soft">
        Tankkosten entstehen automatisch aus dem Tankbuch — hier erfasst du alles andere.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-3 grid grid-cols-2 items-end gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        <Field label="Datum">
          <TextInput type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Kategorie">
          <Select
            aria-label="Kategorie"
            value={category}
            onChange={(e) => setCategory(e.target.value as CostCategory)}
          >
            {manualCategories.map((c) => (
              <option key={c} value={c}>
                {categoryMeta[c].label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Betrag (€)">
          <TextInput
            type="number"
            required
            min={0.01}
            step="0.01"
            placeholder="120,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>
        <Field label="Notiz">
          <TextInput
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="z. B. Teilkasko Q3"
          />
        </Field>
        <PrimaryButton type="submit">Speichern</PrimaryButton>
      </form>
    </Card>
  )
}

export function CostsPage() {
  const { activeVehicle, costEntries, deleteCostEntry } = useAppState()

  const stats = useMemo(() => {
    const now = new Date()
    const sorted = [...costEntries].sort((a, b) => b.date.localeCompare(a.date))
    return {
      sorted,
      month: costsInMonth(costEntries, now.getFullYear(), now.getMonth()),
      year: costsInYear(costEntries, now.getFullYear()),
      total: costEntries.reduce((sum, c) => sum + c.amount, 0),
      byCategory: costsByCategory(costEntries),
      trend: monthlyCostSeries(costEntries, 12),
    }
  }, [costEntries])

  if (!activeVehicle) return <NoVehicleHint title="Noch kein Fahrzeug angelegt" />

  return (
    <div className="rise-in flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Kostenanalyse</h1>

      <AddCostForm />

      {costEntries.length === 0 ? (
        <EmptyState
          icon={<LineChart size={40} />}
          title="Noch keine Kosten erfasst"
          text="Erfasse oben Versicherung, Steuer oder Reparaturen — oder trage einen Tankvorgang im Tankbuch ein. Hier entsteht dann deine komplette Kostenübersicht."
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardLabel>Diesen Monat</CardLabel>
              <BigValue>{formatEuro(stats.month)}</BigValue>
            </Card>
            <Card>
              <CardLabel>Dieses Jahr</CardLabel>
              <BigValue>{formatEuro(stats.year)}</BigValue>
            </Card>
            <Card>
              <CardLabel>Gesamt</CardLabel>
              <BigValue>{formatEuro(stats.total)}</BigValue>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Card>
              <CardLabel>Verteilung nach Kategorie</CardLabel>
              <div className="mt-2 flex items-center gap-4">
                <div className="h-44 w-44 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.byCategory}
                        dataKey="amount"
                        nameKey="category"
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {stats.byCategory.map((entry) => (
                          <Cell
                            key={entry.category}
                            fill={categoryMeta[entry.category as CostCategory].color}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: '#161a22',
                          border: '1px solid #232936',
                          borderRadius: 12,
                          fontSize: 12,
                        }}
                        formatter={(value, name) => [
                          formatEuro(Number(value)),
                          categoryMeta[name as CostCategory].label,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="flex flex-col gap-1.5 text-sm">
                  {stats.byCategory.map(({ category, amount }) => (
                    <li key={category} className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: categoryMeta[category as CostCategory].color }}
                      />
                      <span className="text-ink-soft">
                        {categoryMeta[category as CostCategory].label}
                      </span>
                      <span className="ml-auto font-semibold">{formatEuro(amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card>
              <CardLabel>Monatsverlauf (12 Monate)</CardLabel>
              <div className="mt-3 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.trend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                    <XAxis
                      dataKey="label"
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
                    />
                    <Tooltip
                      cursor={{ fill: '#232936', opacity: 0.4 }}
                      contentStyle={{
                        background: '#161a22',
                        border: '1px solid #232936',
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      formatter={(value) => [formatEuro(Number(value)), 'Kosten']}
                    />
                    <Bar dataKey="amount" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card>
            <CardLabel>Alle Kosten</CardLabel>
            <ul className="mt-2 divide-y divide-edge">
              {stats.sorted.map((entry) => {
                const meta = categoryMeta[entry.category]
                return (
                  <li key={entry.id} className="flex items-center gap-3 py-3">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: meta.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">
                        {meta.label}
                        {entry.note && (
                          <span className="ml-2 font-normal text-ink-soft">{entry.note}</span>
                        )}
                      </div>
                      <div className="text-xs text-ink-soft">{formatDate(entry.date)}</div>
                    </div>
                    <div className="text-sm font-bold">{formatEuro(entry.amount)}</div>
                    {entry.refId ? (
                      <span
                        className="flex w-7 justify-center text-ink-soft/40"
                        title={
                          entry.category === 'fuel'
                            ? 'Aus dem Tankbuch — dort löschen'
                            : 'Aus dem Wartungsmanager — dort löschen'
                        }
                      >
                        {entry.category === 'fuel' ? <Fuel size={15} /> : <Wrench size={15} />}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => deleteCostEntry(entry.id)}
                        className="w-7 p-1.5 text-ink-soft/50 transition hover:text-bad"
                        aria-label="Kosteneintrag löschen"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </Card>
        </>
      )}
    </div>
  )
}
