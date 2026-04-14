import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const defaultCategories = [
  "Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "General"
];

function ExpenseEditModal({ expense, isOpen, onClose, onSave, saving, error, categories = defaultCategories }) {
  const [form, setForm] = useState({ title: "", amount: "", category: "General" });

  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title || "",
        amount: expense.amount?.toString() || "",
        category: expense.category || "General",
      });
    }
  }, [expense]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, saving]);

  if (!isOpen || !expense) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(cur => ({ ...cur, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title: form.title.trim(),
      amount: form.amount,
      category: form.category,
      date: expense.date || new Date().toISOString().slice(0, 10),
    });
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
              <p className="eyebrow" style={{ color: '#38bdf8' }}>Manage Transaction</p>
              <h3>Edit Expense Record</h3>
            </div>
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              disabled={saving}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Expense Title</span>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Groceries, rent, etc."
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
                placeholder="250.00"
                required
              />
            </label>

            <label className="form-field">
              <span>Category Allocation</span>
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            {error ? <div className="alert alert-error">{error}</div> : null}

            <div className="modal-actions" style={{ marginTop: '2rem' }}>
              <button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? "Saving Changes..." : "Secure Update"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ExpenseEditModal;
