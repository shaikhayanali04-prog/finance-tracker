const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "No date";
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function IncomeTable({
  incomes,
  loading,
  onDelete,
  onEdit,
  emptyMessage = "No income found yet.",
}) {
  if (loading) {
    return <div className="empty-state">Loading income...</div>;
  }

  if (!incomes.length) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <>
      <div className="table-wrap desktop-table">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Source</th>
              <th>Date</th>
              <th className="align-right">Amount</th>
              <th className="align-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income.id}>
                <td>{income.title || "Untitled income"}</td>
                <td>{income.source || "Other"}</td>
                <td>{formatDate(income.date)}</td>
                <td className="align-right amount-cell">
                  {currencyFormatter.format(Number(income.amount || 0))}
                </td>
                <td className="align-right">
                  <div className="table-action-group">
                    {onEdit ? (
                      <button
                        type="button"
                        className="button button-ghost"
                        onClick={() => onEdit(income)}
                      >
                        Edit
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="button button-ghost-danger"
                      onClick={() => onDelete(income.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-expense-list">
        {incomes.map((income) => (
          <article className="expense-card" key={income.id}>
            <div>
              <p className="expense-card-title">{income.title || "Untitled income"}</p>
              <p className="expense-card-meta">{income.source || "Other"}</p>
            </div>
            <strong>{currencyFormatter.format(Number(income.amount || 0))}</strong>
            <p className="expense-card-meta">{formatDate(income.date)}</p>
            <div className="mobile-action-row">
              {onEdit ? (
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => onEdit(income)}
                >
                  Edit
                </button>
              ) : null}
              <button
                type="button"
                className="button button-ghost-danger"
                onClick={() => onDelete(income.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export default IncomeTable;
