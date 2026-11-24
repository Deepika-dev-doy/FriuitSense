export default function SensorCard({ title, value, unit, icon: Icon, tone }) {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "--"
      : typeof value === "number"
        ? Number.isInteger(value)
          ? value.toString()
          : value.toFixed(1)
        : value;

  return (
    <article className="sensor-card">
      <div className={`sensor-icon ${tone || ""}`}>
        <Icon size={21} strokeWidth={1.8} />
      </div>
      <div>
        <p className="sensor-title">{title}</p>
        <p className="sensor-value">
          {displayValue}
          {displayValue !== "--" && unit ? (
            <span className="sensor-unit">{unit}</span>
          ) : null}
        </p>
      </div>
    </article>
  );
}
