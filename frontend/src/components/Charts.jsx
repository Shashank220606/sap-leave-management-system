// Lightweight dependency-free SVG/CSS charts (donut + horizontal bars)

export function DonutChart({ data, size = 190, thickness = 26, centerTitle = 'Total' }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="donut">
      <div className="donut-figure" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#edf1f7" strokeWidth={thickness} />
          {total > 0 &&
            data
              .filter((d) => d.value > 0)
              .map((d) => {
                const length = (d.value / total) * circumference;
                const segment = (
                  <circle
                    key={d.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={d.color}
                    strokeWidth={thickness}
                    strokeDasharray={`${length} ${circumference - length}`}
                    strokeDashoffset={-accumulated}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  />
                );
                accumulated += length;
                return segment;
              })}
        </svg>
        <div className="donut-center">
          <strong>{total}</strong>
          <span>{centerTitle}</span>
        </div>
      </div>
      <ul className="chart-legend">
        {data.map((d) => (
          <li key={d.label}>
            <span className="legend-dot" style={{ background: d.color }} />
            <span className="legend-label">{d.label}</span>
            <span className="legend-value">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="bar-chart">
      {data.map((d) => (
        <div key={d.label} className="bar-row">
          <div className="bar-head">
            <span className="bar-label">{d.label}</span>
            <span className="bar-value">
              {d.value} {d.sub ? <em>({d.sub})</em> : null}
            </span>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(d.value / max) * 100}%`, background: d.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}
