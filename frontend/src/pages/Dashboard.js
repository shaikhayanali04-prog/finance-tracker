import { useEffect, useMemo, useState } from "react";
import ExpenseTable from "../components/ExpenseTable";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";

const API_BASE = "http://localhost:8081";
const AUTH_KEY = "finance-tracker-auth";

const categoryOptions = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "General",
];

const getAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
};

const normalizeExpense = (expense) => ({
  id: expense.id,
  title: expense.title || expense.description || "Untitled expense",
  amount: Number(expense.amount || 0),
  category: expense.category || "General",
  date: expense.date || "",
});

function Dashboard() {
  const user = getAuthUser();
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE}/api/expenses`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Unable to load expenses right now.");
      }

      setExpenses(Array.isArray(data) ? data.map(normalizeExpense) : []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load expenses right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleAddExpense = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(form.amount),
          category: form.category,
          description: form.title,
          date: new Date().toISOString().slice(0, 10),
        }),
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText || "Unable to add expense.");
      }

      setForm({ title: "", amount: "", category: "Food" });
      fetchExpenses();
    } catch (requestError) {
      setError(requestError.message || "Unable to add expense.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      setError("");
      const response = await fetch(`${API_BASE}/api/expenses/${expenseId}`, {
        method: "DELETE",
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText || "Unable to delete expense.");
      }

      setExpenses((current) => current.filter((expense) => expense.id !== expenseId));
    } catch (requestError) {
      setError(requestError.message || "Unable to delete expense.");
    }
  };

  const filteredExpenses = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) {
      return expenses;
    }

    return expenses.filter((expense) =>
      [expense.title, expense.category].join(" ").toLowerCase().includes(query)
    );
  }, [expenses, search]);

  const recentExpenses = filteredExpenses.slice(0, 5);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length ? Math.round(totalExpenses / expenses.length) : 0;
  const lastCategory = expenses[0]?.category || "No activity yet";
  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="app-shell">
      <Sidebar user={user} />

      <div className="page-shell">
        <Navbar
          title={`Hello, ${user?.name || "Finance User"}`}
          subtitle="Review your latest expenses, add new entries, and keep your spending under control."
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by title or category"
          actions={
            <button type="button" className="button button-primary" onClick={fetchExpenses}>
              Refresh
            </button>
          }
        />

        {error ? <div className="alert alert-error">{error}</div> : null}

        <div className="summary-grid">
          <SummaryCard
            label="Total Expenses"
            value={currencyFormatter.format(totalExpenses)}
            helper="Combined spend across all recorded expenses"
            tone="primary"
          />
          <SummaryCard
            label="Number of Expenses"
            value={expenses.length}
            helper="Total expense entries synced from your backend"
            tone="emerald"
          />
          <SummaryCard
            label="Average Expense"
            value={currencyFormatter.format(averageExpense)}
            helper="Average amount per expense"
            tone="neutral"
          />
          <SummaryCard
            label="Latest Category"
            value={lastCategory}
            helper="Most recent spending category on your account"
            tone="neutral"
          />
        </div>

        <div className="content-grid">
          <section className="panel form-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Add expense</p>
                <h3>Record a new transaction</h3>
              </div>
            </div>

            <form className="form-grid" onSubmit={handleAddExpense}>
              <label className="form-field">
                <span>Expense title</span>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="Groceries, fuel, rent"
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
                  onChange={handleFormChange}
                  placeholder="250"
                  required
                />
              </label>

              <label className="form-field">
                <span>Category</span>
                <select name="category" value={form.category} onChange={handleFormChange}>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <button type="submit" className="button button-primary button-full" disabled={saving}>
                {saving ? "Saving expense..." : "Add Expense"}
              </button>
            </form>
          </section>

          <section className="panel accent-panel insight-panel">
            <p className="eyebrow">Spending health</p>
            <h3>Keep your finances intentional.</h3>
            <p>
              Search through recent activity, review which categories are growing fastest, and trim small leaks before they grow.
            </p>
            <ul className="feature-list">
              <li>Live totals powered by your backend data</li>
              <li>Recent expense list with instant delete</li>
              <li>Category-based entry form for cleaner tracking</li>
            </ul>
          </section>
        </div>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h3>Latest transactions</h3>
            </div>
            <span className="panel-badge">{filteredExpenses.length} visible</span>
          </div>

          <ExpenseTable
            expenses={recentExpenses}
            loading={loading}
            onDelete={handleDeleteExpense}
            emptyMessage="No recent expenses match your search yet."
          />
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
