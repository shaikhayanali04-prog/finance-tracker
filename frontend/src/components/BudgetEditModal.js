import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const getTodayMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

function BudgetEditModal({ budget, isOpen, onClose, onSave, saving, error, categories }) {
  const [form, setForm] = useState({ amount: "", category: "Food", month: getTodayMonth() });

  useEffect(() => {
    if (budget) {
      setForm({
        amount: budget.amount || "",
        category: budget.category || "Food",
        month: budget.month || getTodayMonth(),
      });
    } else {
        setForm({ amount: "", category: "Food", month: getTodayMonth() });
    }
  }, [budget, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ ...budget, ...form });
  };

  return (
    <AnimatePresence>
      <div 
        className="modal-backdrop"
        onClick={(e) => { if (e.target === e.currentTarget && !saving) onClose(); }}
      >
        <motion.div 
          className="modal-card panel accent-panel"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="modal-header">
            <div>
              <p className="eyebrow" style={{ color: '#10b981' }}>Budget Controls</p>
              <h3>{budget?.id ? "Adjust Budget Limit" : "Allocate New Budget"}</h3>
            </div>
            <button type="button" className="modal-close" onClick={onClose} disabled={saving}>
              <X size={20} />
            </button>
          </div>

          {error ? <div className="alert alert-error">{error}</div> : null}

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Category Focus</span>
              {budget?.id ? (
                  <input type="text" value={form.category} disabled style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }} />
              ) : (
                  <select name="category" value={form.category} onChange={handleFormChange}>
                  {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                  ))}
                  </select>
              )}
            </label>

            <label className="form-field">
              <span>Financial Month</span>
              <input
                type="month"
                name="month"
                value={form.month}
                onChange={handleFormChange}
                required
              />
            </label>

            <label className="form-field">
              <span>Ceiling Limit</span>
              <input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleFormChange}
                required
              />
            </label>

            <div className="modal-actions" style={{ marginTop: '2rem' }}>
              <button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? "Processing..." : "Enforce Limit"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default BudgetEditModal;
