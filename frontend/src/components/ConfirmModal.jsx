export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Delete', isLoading = false }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">🗑️</div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button
            id="modal-cancel-btn"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            id="modal-confirm-btn"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner spinner-sm" />
                Deleting...
              </>
            ) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
