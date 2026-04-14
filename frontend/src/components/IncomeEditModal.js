import { useEffect, useState } from "react";

const defaultSources = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Bonus",
  "Rental",
  "Gift",
  "Other",
];

function IncomeEditModal({
  income,
  isOpen,
  onClose,
  onSave,
  saving,
  error,
  sources = defaultSources,
}) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    source: "Other",
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (!income) {
      return;
    }

    setForm({
      title: income.title || "",
      amount: income.amount?.toString() || "",
      source: income.source || "Other",
      date: income.date || new Date().toISOString().slice(0, 10),
    });
  }, [income]);

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

  if (!isOpen || !income) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      title: form.title.trim(),
      amount: form.amount,
      source: form.source,
      date: form.date,
    });
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
            <p className="eyebrow">Edit income</p>
            <h3>Correct this income entry</h3>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close edit income modal"
          >
            ×
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Income title</span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Monthly salary, client project"
              required
            />
          </label>

          <label className="form-field">
            <span>Amount</span>
            <input
              type="number"
              name="amount"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="50000"
              required
            />
          </label>

          <label className="form-field">
            <span>Source</span>
            <select name="source" value={form.source} onChange={handleChange}>
              {sources.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Date</span>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </label>

          {error ? <div className="alert alert-error">{error}</div> : null}

          <div className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? "Saving changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IncomeEditModal;
