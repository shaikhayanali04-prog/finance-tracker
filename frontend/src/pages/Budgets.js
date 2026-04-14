import { apiFetch } from "../utils/api";
import { useEffect, useMemo, useState } from "react";
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

const normalizeBudget = (budget) => ({
  id: budget.id,
  category: budget.category || "General",
  limitAmount: Number(budget.limitAmount || 0),
  monthPeriod: budget.monthPeriod || new Date().toISOString().slice(0, 7),
});

function Budgets() {
  const user = getAuthUser();
  const [budgets, setBudgets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    category: "Food",
    limitAmount: "",
    monthPeriod: new Date().toISOString().slice(0, 7),
  });

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiFetch(`${API_BASE}/api/budgets`);
      let data = [];
      try {
          data = await response.json();
      } catch (e) {
          throw new Error("Unable to read budgets data format.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to load budgets right now.");
      }

      setBudgets(Array.isArray(data) ? data.map(normalizeBudget) : []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load budgets right now.");
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleAddBudget = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await apiFetch(`${API_BASE}/api/budgets`, {
        method: "POST",
        body: JSON.stringify({
          category: form.category,
          limitAmount: Number(form.limitAmount),
          monthPeriod: form.monthPeriod,
        }),
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText || "Unable to record budget limit.");
      }

      setForm({ category: "Food", limitAmount: "", monthPeriod: new Date().toISOString().slice(0, 7) });
      fetchBudgets();
    } catch (requestError) {
      setError(requestError.message || "Unable to add budget limit.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      setError("");
      const response = await apiFetch(`${API_BASE}/api/budgets/${id}`, {
        method: "DELETE",
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText || "Unable to delete budget limit.");
      }

      setBudgets((current) => current.filter((item) => item.id !== id));
    } catch (requestError) {
      setError(requestError.message || "Unable to delete budget.");
    }
  };

  const filteredBudgets = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) {
      return budgets;
    }
    return budgets.filter((b) =>
      b.category.toLowerCase().includes(query)
    );
  }, [budgets, search]);

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.limitAmount, 0);
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
          title="Budgets"
          subtitle="Set category limits and watch your real-time spend track against them."
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by category"
          actions={
            <button type="button" className="button button-primary" onClick={fetchBudgets}>
              Refresh
            </button>
          }
        />

        {error ? <div className="alert alert-error">{error}</div> : null}

        <div className="summary-grid">
          <SummaryCard
            label="Total Budgeted"
            value={currencyFormatter.format(totalBudgeted)}
            helper="Sum of all category limits for this period"
            tone="emerald"
          />
          <SummaryCard
            label="Active Budgets"
            value={budgets.length}
            helper="Tracking limits established"
            tone="primary"
          />
        </div>

        <div className="content-grid">
          <section className="panel form-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Controls</p>
                <h3>Establish new limit</h3>
              </div>
            </div>

            <form className="form-grid" onSubmit={handleAddBudget}>
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

              <label className="form-field">
                <span>Limit Amount</span>
                <input
                  type="number"
                  name="limitAmount"
                  min="0"
                  step="0.01"
                  value={form.limitAmount}
                  onChange={handleFormChange}
                  placeholder="5000"
                  required
                />
              </label>

              <label className="form-field">
                <span>Month</span>
                <input
                  type="month"
                  name="monthPeriod"
                  value={form.monthPeriod}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <button type="submit" className="button button-primary button-full" disabled={saving}>
                {saving ? "Setting limit..." : "Create Limit"}
              </button>
            </form>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Active Limits</p>
                <h3>Your active tracking constraints</h3>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem", opacity: 0.5 }}>Loading...</div>
            ) : filteredBudgets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "var(--background)", borderRadius: "8px" }}>
                <p>No budgets set for this period.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Period</th>
                      <th>Limit</th>
                      <th align="right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBudgets.map((b) => (
                      <tr key={b.id}>
                        <td><strong>{b.category}</strong></td>
                        <td>{b.monthPeriod}</td>
                        <td>{currencyFormatter.format(b.limitAmount)}</td>
                        <td align="right">
                          <button className="button button-ghost button-sm" style={{ color: "var(--danger)" }} onClick={() => handleDeleteBudget(b.id)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Budgets;
