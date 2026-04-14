import { motion } from "framer-motion";
import { Edit2, Trash2, IndianRupee } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatDate = (dateValue) => {
  if (!dateValue) return "No date";
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? dateValue : parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

function ExpenseTable({ expenses, loading, onDelete, onEdit, emptyMessage = "No transactions available right now." }) {
  if (loading) {
    return <div className="empty-state"><h3>Loading Telemetry...</h3><p>Connecting to backend...</p></div>;
  }

  if (!expenses.length) {
    return (
      <div className="empty-state">
        <IndianRupee size={48} color="#94a3b8" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <h3>Zero Data Flow</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-wrap desktop-table">
        <table className="expense-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '1.25rem' }}>Transaction Entity</th>
              <th>Category</th>
              <th>Timestamp</th>
              <th style={{ textAlign: 'right' }}>Volume</th>
              <th style={{ textAlign: 'right', paddingRight: '1rem' }}>Controls</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, i) => (
              <motion.tr 
                key={expense.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <td style={{ padding: '1.25rem', fontWeight: 500 }}>{expense.title || "Unknown"}</td>
                <td style={{ color: '#94a3b8' }}>{expense.category || "General"}</td>
                <td style={{ color: '#94a3b8' }}>{formatDate(expense.date)}</td>
                <td style={{ textAlign: 'right', fontWeight: 600, color: '#f8fafc' }}>
                  {currencyFormatter.format(Number(expense.amount || 0))}
                </td>
                <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
                  <div className="table-actions" style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    {onEdit ? (
                      <button type="button" className="button button-ghost" onClick={() => onEdit(expense)} title="Edit Record">
                        <Edit2 size={16} />
                      </button>
                    ) : null}
                    <button type="button" className="button" style={{ background: 'rgba(225, 29, 72, 0.1)', color: '#f43f5e', border: '1px solid rgba(225, 29, 72, 0.2)' }} onClick={() => onDelete(expense.id)} title="Delete Record">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ExpenseTable;
