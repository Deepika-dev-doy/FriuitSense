import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function SensorChart({ title, dataKey, data, unit, color }) {
  const chartData = data
    .filter((item) => item[dataKey] !== null)
    .map((item) => ({
      ...item,
      time: item.createdAt
        ? new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "--",
    }));

  return (
    <article className="chart-card">
      <div className="chart-header">
        <div>
          <p className="chart-eyebrow">Historical data</p>
          <h3>{title}</h3>
        </div>
        {unit ? <span className="chart-unit">{unit}</span> : null}
      </div>
      {chartData.length === 0 ? (
        <div className="chart-empty">No chart data available.</div>
      ) : (
        <div className="chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#dfe7e2" />
              <XAxis dataKey="time" tick={{ fill: "#7b8881", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#7b8881", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #e2e8e4",
                  boxShadow: "0 8px 24px rgba(29, 55, 43, 0.10)",
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${dataKey})`}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}
