import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Car, Fuel, Sparkles, TrendingUp } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts'
import { useAppState } from '../state/AppState'
import {
  autoScore,
  averageConsumption,
  costsInMonth,
  monthlyCostSeries,
} from '../lib/calculations'
import { formatDate, formatEuro, formatKm, formatNumber } from '../lib/format'
import { BigValue, Card, CardLabel, EmptyState, PrimaryButton } from '../components/ui'
import { ScoreRing } from '../components/ScoreRing'

function LicensePlate({ plate }: { plate: string }) {
  if (!plate) return null
  return (
    <span className="inline-flex items-center overflow-hidden rounded-md border border-white/20 bg-white font-bold text-black">
      <span className="flex items-center self-stretch bg-blue-700 px-1.5 text-[10px] text-white">D</span>
      <span className="px-2 py-0.5 text-xs tracking-widest">{plate}</span>
    </span>
  )
}

export function DashboardPage() {
  const { activeVehicle, fuelEntries, costEntries } = useAppState()

  const data = useMemo(() => {
    if (!activeVehicle) return null
    const now = new Date()
    return {
      score: autoScore(activeVehicle, fuelEntries),
      monthCosts: costsInMonth(costEntries, now.getFullYear(), now.getMonth()),
      trend: monthlyCostSeries(costEntries, 6),
      avg: averageConsumption(fuelEntries),
      lastFuel: fuelEntries[0] ?? null,
    }
  }, [activeVehicle, fuelEntries, costEntries])

  if (!activeVehicle || !data) {
    return (
      <div className="mx-auto max-w-xl pt-10">
        <EmptyState
          icon={<Car size={44} />}
          title="Deine Fahrzeugzentrale wartet"
          text="Lege dein Fahrzeug an — danach siehst du hier AutoScore, Kosten, Verbrauch und Empfehlungen auf einen Blick."
          action={
            <Link to="/fahrzeug">
              <PrimaryButton>Fahrzeug anlegen</PrimaryButton>
            </Link>
          }
        />
      </div>
    )
  }

  const v = activeVehicle

  return (
    <div className="rise-in flex flex-col gap-4">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-edge bg-card">
        {v.imageDataUrl ? (
          <>
            <img
              src={v.imageDataUrl}
              alt={`${v.make} ${v.model}`}
              className="h-56 w-full object-cover sm:h-72"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
          </>
        ) : (
          <div className="flex h-56 items-center justify-center text-ink-soft sm:h-72">
            <Link to="/fahrzeug" className="flex flex-col items-center gap-2 transition hover:text-accent">
              <Car size={48} className="text-accent" />
              <span className="text-sm font-semibold">Fahrzeugfoto hinzufügen</span>
            </Link>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {v.make} {v.model}
            </h1>
            <div className="mt-1.5 flex items-center gap-2.5">
              <LicensePlate plate={v.licensePlate} />
              <span className="text-sm font-semibold text-ink-soft">{formatKm(v.currentKm)}</span>
            </div>
          </div>
          <div className="shrink-0 rounded-2xl bg-night/70 p-2 backdrop-blur">
            <ScoreRing score={data.score} />
            <div className="mt-1 text-center text-[10px] font-bold tracking-widest text-ink-soft uppercase">
              AutoScore
            </div>
          </div>
        </div>
      </div>

      {/* Key figures */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardLabel>Kosten diesen Monat</CardLabel>
          <BigValue>{formatEuro(data.monthCosts)}</BigValue>
          {data.trend.some((m) => m.amount > 0) && (
            <div className="mt-2 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.trend} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <XAxis dataKey="label" hide />
                  <Bar dataKey="amount" fill="#22d3ee" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <CardLabel>Ø Verbrauch</CardLabel>
          <BigValue>{data.avg !== null ? `${formatNumber(data.avg)} l` : '—'}</BigValue>
          <div className="mt-1 text-xs text-ink-soft">
            {data.avg !== null ? 'pro 100 km' : 'ab 2. Volltankung'}
          </div>
        </Card>

        <Card>
          <CardLabel>Letzte Tankfüllung</CardLabel>
          <BigValue>
            {data.lastFuel ? formatEuro(data.lastFuel.totalPrice) : '—'}
          </BigValue>
          <div className="mt-1 text-xs text-ink-soft">
            {data.lastFuel ? formatDate(data.lastFuel.date) : 'noch keine erfasst'}
          </div>
        </Card>

        <Card>
          <CardLabel>Marktwert</CardLabel>
          <BigValue>
            <span className="text-ink-soft">—</span>
          </BigValue>
          <div className="mt-1 text-xs text-ink-soft">KI-Schätzung ab Phase 3</div>
        </Card>
      </div>

      {/* Outlook cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-dim/40 text-accent">
            <Bell size={18} />
          </div>
          <div>
            <CardLabel>Nächster Termin</CardLabel>
            <div className="mt-1 text-sm font-semibold">Erinnerungscenter folgt in Phase 2</div>
            <p className="mt-0.5 text-xs text-ink-soft">
              TÜV, Ölwechsel und Versicherung — automatisch im Blick.
            </p>
          </div>
        </Card>
        <Card className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-dim/40 text-accent">
            <Sparkles size={18} />
          </div>
          <div>
            <CardLabel>KI-Empfehlung</CardLabel>
            <div className="mt-1 text-sm font-semibold">
              {fuelEntries.length === 0
                ? 'Erfasse deinen ersten Tankvorgang im Tankbuch.'
                : data.score < 75
                  ? 'Vervollständige deine Fahrzeugdaten für einen besseren AutoScore.'
                  : 'Starke Pflege! Dein Fahrzeugprofil ist auf Kurs.'}
            </div>
            <p className="mt-0.5 text-xs text-ink-soft">Echte KI-Analysen folgen in Phase 3.</p>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Link
          to="/tankbuch"
          className="flex items-center gap-2 rounded-xl border border-edge px-4 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
        >
          <Fuel size={16} /> Tankvorgang erfassen
        </Link>
        <Link
          to="/fahrzeug"
          className="flex items-center gap-2 rounded-xl border border-edge px-4 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
        >
          <TrendingUp size={16} /> Fahrzeugakte öffnen
        </Link>
      </div>
    </div>
  )
}
