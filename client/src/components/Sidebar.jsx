import {
  BarChart3,
  Bell,
  CircleGauge,
  CircleHelp,
  FlaskConical,
  Leaf,
  Radio,
  X,
} from "lucide-react";

const items = [
  { id: "dashboard", label: "Dashboard", icon: CircleGauge },
  { id: "live", label: "Live Monitoring", icon: Radio },
  { id: "history", label: "Sensor History", icon: BarChart3 },
  { id: "analysis", label: "Fruit Analysis", icon: FlaskConical },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "about", label: "About Project", icon: CircleHelp },
];

export default function Sidebar({ activePage, setActivePage, open, setOpen }) {
  return (
    <>
      {open ? (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Leaf size={21} /></div>
          <div>
            <strong>FruitSense</strong>
            <span>IoT Monitoring</span>
          </div>
          <button className="sidebar-close" onClick={() => setOpen(false)} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>
        <nav aria-label="Main navigation">
          <p className="nav-label">MONITORING</p>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={activePage === item.id ? "nav-item active" : "nav-item"}
                onClick={() => {
                  setActivePage(item.id);
                  setOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <span className="footer-pulse" />
          <div>
            <strong>System Status</strong>
            <span>ESP32 Gateway</span>
          </div>
        </div>
      </aside>
    </>
  );
}
