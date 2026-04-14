import { useEffect, useMemo, useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function IncomeTotalAdjustModal({
  isOpen,
  currentTotal,
  onClose,
  onSave,
  saving,
  error,
}) {
  const [targetTotal, setTargetTotal] = useState("0");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setTargetTotal(currentTotal.toFixed(2));
  }, [currentTotal, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, saving]);

  const parsedTarget = Number(targetTotal || 0);
  const difference = useMemo(() => parsedTarget - currentTotal, [currentTotal, parsedTarget]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(parsedTarget);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div className="modal-card panel">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Adjust total income</p>
            <h3>Set the exact total you want</h3>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close total income modal"
          >
            ×
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Desired total income</span>
            <input
              type="number"
              min="-999999999"
              step="0.01"
              value={targetTotal}
              onChange={(event) => setTargetTotal(event.target.value)}
              placeholder="50000"
              required
            />
          </label>

          <div className="detail-list summary-detail-list">
            <div>
              <span>Current total</span>
              <strong>{currencyFormatter.format(currentTotal)}</strong>
            </div>
            <div>
              <span>Adjustment that will be created</span>
              <strong>{currencyFormatter.format(difference)}</strong>
            </div>
          </div>

          <p className="muted-text">
            This creates a correction income entry so your stored total matches the number you set here.
          </p>

          {error ? <div className="alert alert-error">{error}</div> : null}

          <div className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? "Applying adjustment..." : "Update Total Income"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IncomeTotalAdjustModal;
