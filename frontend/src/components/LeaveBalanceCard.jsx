export default function LeaveBalanceCard({ balance }) {
  const { leaveType, leaveTypeName, color, soft, totalDays, usedDays, availableDays } = balance;
  const usedPct = totalDays ? Math.round((usedDays / totalDays) * 100) : 0;

  return (
    <div className="card balance-card">
      <div className="balance-card-top">
        <span className="leave-chip" style={{ background: soft, color }} title={leaveTypeName}>
          {leaveType}
        </span>
        <h3>{leaveTypeName}</h3>
      </div>
      <p className="balance-available">
        <strong>{availableDays}</strong>
        <span>days available</span>
      </p>
      <div className="progress-track" title={`${usedPct}% used`}>
        <div className="progress-fill" style={{ width: `${usedPct}%`, background: color }} />
      </div>
      <div className="balance-meta">
        <span>Used: {usedDays} days</span>
        <span>Total: {totalDays} days</span>
      </div>
    </div>
  );
}
