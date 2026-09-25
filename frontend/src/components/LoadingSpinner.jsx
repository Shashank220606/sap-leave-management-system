export default function LoadingSpinner({ size = 32, label = 'Loading...' }) {
  return (
    <div className="spinner-wrap" role="status">
      <span className="spinner" style={{ width: size, height: size }} />
      {label && <p className="spinner-label">{label}</p>}
    </div>
  );
}
