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

function ExpenseTable({ expenses, loading, onDelete, emptyMessage = "No expenses found yet." }) {
  if (loading) {
    return <div className="empty-state">Loading expenses...</div>;
  }

  if (!expenses.length) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <>
      <div className="table-wrap desktop-table">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th className="align-right">Amount</th>
              <th className="align-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.title || "Untitled expense"}</td>
                <td>{expense.category || "General"}</td>
                <td>{formatDate(expense.date)}</td>
                <td className="align-right amount-cell">
                  {currencyFormatter.format(Number(expense.amount || 0))}
                </td>
                <td className="align-right">
                  <button
                    type="button"
                    className="button button-ghost-danger"
                    onClick={() => onDelete(expense.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-expense-list">
        {expenses.map((expense) => (
          <article className="expense-card" key={expense.id}>
            <div>
              <p className="expense-card-title">{expense.title || "Untitled expense"}</p>
              <p className="expense-card-meta">{expense.category || "General"}</p>
            </div>
            <strong>{currencyFormatter.format(Number(expense.amount || 0))}</strong>
            <p className="expense-card-meta">{formatDate(expense.date)}</p>
            <button
              type="button"
              className="button button-ghost-danger"
              onClick={() => onDelete(expense.id)}
            >
              Delete
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

export default ExpenseTable;
