import { Bell, TriangleAlert } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function NotificationPanel({ latest }) {
  const rotten = latest?.stage === "ROTTEN";
  return (
    <aside className="notification-panel">
      <div className="panel-heading">
        <div>
          <p className="section-eyebrow">Fruit stage alerts</p>
          <h2>Notifications</h2>
        </div>
        <Bell size={19} />
      </div>

      {latest ? (
        <div className={`alert-row ${rotten ? "alert-critical" : ""}`}>
          <TriangleAlert size={18} />
          <div>
            <div className="alert-title-row">
              <strong>Latest fruit stage</strong>
              <StatusBadge stage={latest.stage} />
            </div>
            <p>
              {rotten
                ? "ROTTEN classification detected in the latest reading."
                : `The latest reading is classified as ${latest.stage}.`}
            </p>
          </div>
        </div>
      ) : (
        <p className="empty-notification">Waiting for fruit-stage data.</p>
      )}

      <p className="notification-note">
        Email and mobile alerts will be integrated later. Existing firmware email
        notifications are not duplicated here.
      </p>
    </aside>
  );
}
