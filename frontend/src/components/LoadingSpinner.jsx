export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" role="status" aria-label="Loading" />
      <span>{message}</span>
    </div>
  );
}
