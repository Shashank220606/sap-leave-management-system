export default function StatCard({ icon: Icon, label, value, tone = 'blue' }) {
  return (
    <div className="card stat-card">
      <div className={`stat-icon tone-${tone}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}
