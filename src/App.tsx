import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import PapersPage from './pages/PapersPage';
import ListeningPage from './pages/ListeningPage';
import ReadingPage from './pages/ReadingPage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import { HealthProvider } from './components/common/HealthMonitor';
import { HealthMonitorPanel } from './components/common/HealthMonitor';

export default function App() {
  return (
    <HealthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="papers" element={<PapersPage />} />
            <Route path="listening" element={<ListeningPage />} />
            <Route path="reading" element={<ReadingPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="monitor" element={<HealthMonitorPanel />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HealthProvider>
  );
}
