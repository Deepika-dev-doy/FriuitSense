const labels = {
  RAW: { label: "RAW", className: "status-raw" },
  RIPE: { label: "RIPE", className: "status-ripe" },
  ROTTEN: { label: "ROTTEN", className: "status-rotten" },
};

export default function StatusBadge({ stage }) {
  const status = labels[stage] || {
    label: "UNKNOWN",
    className: "status-unknown",
  };

  return (
    <span className={`status-badge ${status.className}`}>
      <span className="status-dot" />
      {status.label}
    </span>
  );
}
