import { useEffect, useMemo, useState } from "react";
import ExpenseTable from "../components/ExpenseTable";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const API_BASE = "http://localhost:8081";
const AUTH_KEY = "finance-tracker-auth";

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

function Expenses() {
  const user = getAuthUser();
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE}/api/expenses`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Unable to load expense history.");
      }

      setExpenses(Array.isArray(data) ? data.map(normalizeExpense) : []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load expense history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

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

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(expenses.map((expense) => expense.category || "General"))
    );
    return ["All", ...uniqueCategories];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const query = search.toLowerCase().trim();

    return expenses.filter((expense) => {
      const matchesSearch = [expense.title, expense.category]
        .join(" ")
        .toLowerCase()
        .includes(query);
      const matchesCategory = category === "All" || expense.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, expenses, search]);

  return (
    <div className="app-shell">
      <Sidebar user={user} />

      <div className="page-shell">
        <Navbar
          title="Expense History"
          subtitle="Browse every expense synced from your backend and filter by title or category."
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search expenses"
          actions={
            <div className="filter-inline">
              <label className="select-field">
                <span>Category</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="button button-secondary" onClick={fetchExpenses}>
                Refresh
              </button>
            </div>
          }
        />

        {error ? <div className="alert alert-error">{error}</div> : null}

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">All expenses</p>
              <h3>{filteredExpenses.length} transactions available</h3>
            </div>
            <span className="panel-badge">Synced from Spring Boot</span>
          </div>

          <ExpenseTable
            expenses={filteredExpenses}
            loading={loading}
            onDelete={handleDeleteExpense}
            emptyMessage="No expenses match this search or filter right now."
          />
        </section>
      </div>
    </div>
  );
}

export default Expenses;
