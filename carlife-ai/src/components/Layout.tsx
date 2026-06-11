import { NavLink, Outlet } from 'react-router-dom'
import {
  Car,
  CircleGauge,
  Fuel,
  LineChart,
  Wrench,
  Bell,
  Images,
  Sparkles,
} from 'lucide-react'
import { useAppState } from '../state/AppState'

const navItems = [
  { to: '/', label: 'Dashboard', icon: CircleGauge, end: true },
  { to: '/fahrzeug', label: 'Fahrzeug', icon: Car },
  { to: '/tankbuch', label: 'Tankbuch', icon: Fuel },
]

const upcoming = [
  { label: 'Kostenanalyse', icon: LineChart },
  { label: 'Wartung', icon: Wrench },
  { label: 'Erinnerungen', icon: Bell },
  { label: 'Fahrzeugalbum', icon: Images },
  { label: 'KI-Scanner', icon: Sparkles },
]

function VehicleSwitcher() {
  const { vehicles, activeVehicle, setActiveVehicle } = useAppState()
  if (vehicles.length < 2) return null
  return (
    <select
      value={activeVehicle?.id ?? ''}
      onChange={(e) => setActiveVehicle(e.target.value)}
      className="rounded-lg border border-edge bg-card px-2.5 py-1.5 text-xs font-semibold text-ink outline-none"
      aria-label="Fahrzeug wechseln"
    >
      {vehicles.map((v) => (
        <option key={v.id} value={v.id}>
          {v.make} {v.model}
        </option>
      ))}
    </select>
  )
}

export function Layout() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-edge p-5 md:flex">
        <div className="mb-8 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-extrabold text-night">
            C
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            CarLife <span className="text-accent">AI</span>
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? 'bg-card text-accent' : 'text-ink-soft hover:bg-card hover:text-ink'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8">
          <div className="px-3 text-[10px] font-bold tracking-widest text-ink-soft/60 uppercase">
            Bald verfügbar
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {upcoming.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-ink-soft/40"
              >
                <Icon size={18} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar (mobile) */}
        <header className="flex items-center justify-between border-b border-edge px-4 py-3 md:justify-end">
          <span className="text-base font-extrabold tracking-tight md:hidden">
            CarLife <span className="text-accent">AI</span>
          </span>
          <VehicleSwitcher />
        </header>

        <main className="flex-1 px-4 py-5 pb-24 md:px-8 md:pb-8">
          <Outlet />
        </main>

        {/* Bottom tabs (mobile) */}
        <nav className="fixed inset-x-0 bottom-0 z-10 flex justify-around border-t border-edge bg-night/95 px-2 py-2 backdrop-blur md:hidden">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-lg px-4 py-1 text-[11px] font-semibold ${
                  isActive ? 'text-accent' : 'text-ink-soft'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
