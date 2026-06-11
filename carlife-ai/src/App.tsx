import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppStateProvider } from './state/AppState'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/Dashboard'
import { VehiclePage } from './pages/Vehicle'
import { FuelLogPage } from './pages/FuelLog'

export default function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/fahrzeug" element={<VehiclePage />} />
            <Route path="/tankbuch" element={<FuelLogPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppStateProvider>
  )
}
