import { useState } from "react";
import {
  Cloud,
  Droplets,
  Gauge,
  Menu,
  RefreshCw,
  Thermometer,
  Waves,
  Wifi,
  WifiOff,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import SensorCard from "./components/SensorCard";
import StatusBadge from "./components/StatusBadge";
import SensorChart from "./components/SensorChart";
import NotificationPanel from "./components/NotificationPanel";
import LoadingIndicator from "./components/LoadingIndicator";
import { useSensorData } from "./hooks/useSensorData";

const pageTitles = {
  dashboard: "Dashboard",
  live: "Live Monitoring",
  history: "Sensor History",
  analysis: "Fruit Analysis",
  notifications: "Notifications",
  about: "About Project",
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const { latest, history, loading, error, lastFetched, refresh } =
    useSensorData();
  const connected = Boolean(latest && !error);

  const formatUpdate = (value) =>
    value
      ? value.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "--";

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <div>
              <p className="breadcrumb">MONITORING / {activePage.toUpperCase()}</p>
              <h1>{pageTitles[activePage]}</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <span className={`connection-pill ${connected ? "connected" : "disconnected"}`}>
              {connected ? <Wifi size={15} /> : <WifiOff size={15} />}
              {connected ? "ThingSpeak connected" : "Not connected"}
            </span>
            <button className="refresh-button" onClick={refresh} aria-label="Refresh sensor data">
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {loading ? (
          <LoadingIndicator />
        ) : error ? (
          <section className="error-state" role="alert">
            <WifiOff size={30} />
            <h2>Sensor data unavailable</h2>
            <p>{error}</p>
            <button onClick={refresh}>Try again</button>
          </section>
        ) : (
          <div className="dashboard">
            <section className="overview-row">
              <article className="overview-card primary-overview">
                <div className="overview-icon"><Cloud size={22} /></div>
                <div>
                  <p>Last data update</p>
                  <strong>
                    {latest?.createdAt
                      ? new Date(latest.createdAt).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "medium",
                        })
                      : "Waiting for data"}
                  </strong>
                </div>
              </article>
              <article className="overview-card">
                <div>
                  <p>Current fruit selection</p>
                  <strong>Not configured</strong>
                </div>
              </article>
              <article className="overview-card">
                <div>
                  <p>Ripeness status</p>
                  <StatusBadge stage={latest?.stage} />
                </div>
              </article>
              <article className="overview-card">
                <div>
                  <p>Monitored samples</p>
                  <strong>{history.length ? history.length : "--"}</strong>
                </div>
              </article>
            </section>

            <section className="sensor-grid">
              <SensorCard title="Temperature" value={latest?.temperature} unit="°C" icon={Thermometer} tone="tone-orange" />
              <SensorCard title="Humidity" value={latest?.humidity} unit="%" icon={Droplets} tone="tone-blue" />
              <SensorCard title="MQ-3 Reading" value={latest?.mq3} icon={Waves} tone="tone-purple" />
              <SensorCard title="MQ-135 Reading" value={latest?.mq135} icon={Gauge} tone="tone-teal" />
              <SensorCard title="Ripeness Score" value={latest?.ripenessScore} icon={Gauge} tone="tone-green" />
              <article className="sensor-card classification-card">
                <div className="sensor-icon tone-yellow"><FlaskIcon /></div>
                <div>
                  <p className="sensor-title">Fruit classification</p>
                  <StatusBadge stage={latest?.stage} />
                </div>
              </article>
            </section>

            <section className="content-grid">
              <div className="charts-section">
                <div className="section-heading">
                  <div>
                    <p className="section-eyebrow">ThingSpeak channel</p>
                    <h2>Sensor trends</h2>
                  </div>
                  <span>Updated {formatUpdate(lastFetched)}</span>
                </div>
                <div className="charts-grid">
                  <SensorChart title="Temperature" dataKey="temperature" data={history} unit="°C" color="#e78b54" />
                  <SensorChart title="Humidity" dataKey="humidity" data={history} unit="%" color="#4e91c9" />
                  <SensorChart title="MQ-3" dataKey="mq3" data={history} color="#8466a9" />
                  <SensorChart title="MQ-135" dataKey="mq135" data={history} color="#3a9e91" />
                  <SensorChart title="Ripeness Score" dataKey="ripenessScore" data={history} color="#72a94f" />
                </div>
              </div>
              <NotificationPanel latest={latest} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function FlaskIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6" />
      <path d="M10 3v6l-5 9a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2l-5-9V3" />
      <path d="M7.5 15h9" />
    </svg>
  );
}

export default App;
