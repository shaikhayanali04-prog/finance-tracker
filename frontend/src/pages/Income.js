import { apiFetch } from "../utils/api";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";

const API_BASE = "http://localhost:8081";
const AUTH_KEY = "finance-tracker-auth";

const getAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
};

const normalizeIncome = (income) => ({
  id: income.id,
  title: income.title || "Untitled Income",
  amount: Number(income.amount || 0),
  source: income.source || "Other",
  date: income.date || new Date().toISOString().slice(0, 10),
});

function Income() {
  const user = getAuthUser();
  const [incomes, setIncomes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    amount: "",
    source: "Salary",
    date: new Date().toISOString().slice(0, 10),
  });

  const fetchIncome = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiFetch(`${API_BASE}/api/income`);
      let data = [];
      try {
          data = await response.json();
      } catch (e) {
          throw new Error("Unable to read income data format.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to load income right now.");
      }

      setIncomes(Array.isArray(data) ? data.map(normalizeIncome) : []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load income right now.");
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleAddIncome = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await apiFetch(`${API_BASE}/api/income`, {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          amount: Number(form.amount),
          source: form.source,
          date: form.date,
        }),
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText || "Unable to register income form.");
      }

      setForm({ title: "", amount: "", source: "Salary", date: new Date().toISOString().slice(0, 10) });
      fetchIncome();
    } catch (requestError) {
      setError(requestError.message || "Unable to add income entry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      setError("");
      const response = await apiFetch(`${API_BASE}/api/income/${id}`, {
        method: "DELETE",
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText || "Unable to delete income registry.");
      }

      setIncomes((current) => current.filter((item) => item.id !== id));
    } catch (requestError) {
      setError(requestError.message || "Unable to delete income.");
    }
  };

  const filteredIncomes = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return incomes;
    return incomes.filter((i) => i.title.toLowerCase().includes(query) || i.source.toLowerCase().includes(query));
  }, [incomes, search]);

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="app-shell">
      <Sidebar user={user} />

      <div className="page-shell">
        <Navbar
          title="Income Streams"
          subtitle="Record paychecks, bonuses, and side hustles to build your financial foundation."
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by title or source"
          actions={
            <button type="button" className="button button-primary" onClick={fetchIncome}>
              Refresh
            </button>
          }
        />

        {error ? <div className="alert alert-error">{error}</div> : null}

        <div className="summary-grid">
          <SummaryCard
            label="Total Income"
            value={currencyFormatter.format(totalIncome)}
            helper="Cumulative recorded income"
            tone="emerald"
          />
          <SummaryCard
            label="Income Sources"
            value={incomes.length}
            helper="Total individual income records"
            tone="primary"
          />
        </div>

        <div className="content-grid">
          <section className="panel form-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Controls</p>
                <h3>Establish Income Form</h3>
              </div>
            </div>

            <form className="form-grid" onSubmit={handleAddIncome}>
              <label className="form-field">
                <span>Income Title</span>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="March Salary, Side Gig"
                  required
                />
              </label>

              <label className="form-field">
                <span>Amount</span>
                <input
                  type="number"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={handleFormChange}
                  placeholder="50000"
                  required
                />
              </label>

              <label className="form-field">
                <span>Source</span>
                <input
                  type="text"
                  name="source"
                  value={form.source}
                  onChange={handleFormChange}
                  placeholder="Company, Client, Interest"
                  required
                />
              </label>

              <label className="form-field">
                <span>Date Received</span>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <button type="submit" className="button button-primary button-full" disabled={saving}>
                {saving ? "Registering..." : "Add Income"}
              </button>
            </form>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Active Incomes</p>
                <h3>Your financial history ledgers</h3>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem", opacity: 0.5 }}>Loading...</div>
            ) : filteredIncomes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "var(--background)", borderRadius: "8px" }}>
                <p>No active income ledgers found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Source</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th align="right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncomes.map((i) => (
                        <tr key={i.id}>
                          <td><strong>{i.title}</strong></td>
                          <td>{i.source}</td>
                          <td>{i.date}</td>
                          <td>{currencyFormatter.format(i.amount)}</td>
                          <td align="right">
                            <button className="button button-ghost button-sm" style={{ color: "var(--danger)" }} onClick={() => handleDeleteIncome(i.id)}>
                              Delete
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

export default Income;
