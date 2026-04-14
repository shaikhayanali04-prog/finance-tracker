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

const normalizeGoal = (goal) => ({
  id: goal.id,
  title: goal.title || "Untitled Goal",
  targetAmount: Number(goal.targetAmount || 0),
  currentAmount: Number(goal.currentAmount || 0),
  deadline: goal.deadline || new Date().toISOString().slice(0, 10),
});

function Goals() {
  const user = getAuthUser();
  const [goals, setGoals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
  });

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiFetch(`${API_BASE}/api/goals`);
      let data = [];
      try {
          data = await response.json();
      } catch (e) {
          throw new Error("Unable to read goals data format.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Unable to load goals right now.");
      }

      setGoals(Array.isArray(data) ? data.map(normalizeGoal) : []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load goals right now.");
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleAddGoal = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await apiFetch(`${API_BASE}/api/goals`, {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          targetAmount: Number(form.targetAmount),
          currentAmount: Number(form.currentAmount || 0),
          deadline: form.deadline,
        }),
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText || "Unable to add saving goal.");
      }

      setForm({ title: "", targetAmount: "", currentAmount: "0", deadline: "" });
      fetchGoals();
    } catch (requestError) {
      setError(requestError.message || "Unable to add goal.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      setError("");
      const response = await apiFetch(`${API_BASE}/api/goals/${id}`, {
        method: "DELETE",
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText || "Unable to delete goal.");
      }

      setGoals((current) => current.filter((item) => item.id !== id));
    } catch (requestError) {
      setError(requestError.message || "Unable to delete goal.");
    }
  };

  const filteredGoals = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return goals;
    return goals.filter((g) => g.title.toLowerCase().includes(query));
  }, [goals, search]);

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  return (
    <div className="app-shell">
      <Sidebar user={user} />

      <div className="page-shell">
        <Navbar
          title="Savings Goals"
          subtitle="Define goals, set deadlines, and visualize your progress to financial freedom."
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by goal title"
          actions={
            <button type="button" className="button button-primary" onClick={fetchGoals}>
              Refresh
            </button>
          }
        />

        {error ? <div className="alert alert-error">{error}</div> : null}

        <div className="summary-grid">
          <SummaryCard
            label="Total Saved"
            value={currencyFormatter.format(totalSaved)}
            helper="Cumulative savings across all active goals"
            tone="emerald"
          />
          <SummaryCard
            label="Total Target"
            value={currencyFormatter.format(totalTarget)}
            helper="The combined target amount for all goals"
            tone="primary"
          />
        </div>

        <div className="content-grid">
          <section className="panel form-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Controls</p>
                <h3>Establish new goal</h3>
              </div>
            </div>

            <form className="form-grid" onSubmit={handleAddGoal}>
              <label className="form-field">
                <span>Goal Title</span>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="Vacation Fund, New Car"
                  required
                />
              </label>

              <label className="form-field">
                <span>Target Amount</span>
                <input
                  type="number"
                  name="targetAmount"
                  min="1"
                  step="0.01"
                  value={form.targetAmount}
                  onChange={handleFormChange}
                  placeholder="100000"
                  required
                />
              </label>

              <label className="form-field">
                <span>Current Saved</span>
                <input
                  type="number"
                  name="currentAmount"
                  min="0"
                  step="0.01"
                  value={form.currentAmount}
                  onChange={handleFormChange}
                  placeholder="0"
                  required
                />
              </label>

              <label className="form-field">
                <span>Deadline</span>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <button type="submit" className="button button-primary button-full" disabled={saving}>
                {saving ? "Setting goal..." : "Create Goal"}
              </button>
            </form>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Active Goals</p>
                <h3>Your active financial milestones</h3>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem", opacity: 0.5 }}>Loading...</div>
            ) : filteredGoals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "var(--background)", borderRadius: "8px" }}>
                <p>No active savings goals found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Progress</th>
                      <th>Deadline</th>
                      <th align="right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGoals.map((g) => {
                      const progress = Math.min((g.currentAmount / Math.max(g.targetAmount, 1)) * 100, 100);
                      return (
                        <tr key={g.id}>
                          <td><strong>{g.title}</strong></td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <span>{currencyFormatter.format(g.currentAmount)} / {currencyFormatter.format(g.targetAmount)}</span>
                              <div style={{ appearance: 'none', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', width: '100%', overflow: 'hidden' }}>
                                <div style={{ width: \`\${progress}%\`, height: '100%', background: 'var(--primary)', borderRadius: '10px' }} />
                              </div>
                            </div>
                          </td>
                          <td>{g.deadline}</td>
                          <td align="right">
                            <button className="button button-ghost button-sm" style={{ color: "var(--danger)" }} onClick={() => handleDeleteGoal(g.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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

export default Goals;
