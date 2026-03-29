import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AnalyticsChartCard from "../components/AnalyticsChartCard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";

const API_BASE = "http://localhost:8081";
const AUTH_KEY = "finance-tracker-auth";
const TREND_DAYS = 30;
const PIE_COLORS = ["#1f3f93", "#12957b", "#6a7ff0", "#3dbd9f", "#7f56d9", "#f59e0b"];
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

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

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

const startOfDay = (value) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

const formatShortDate = (value) =>
  value.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const formatMonthLabel = (value) =>
  value.toLocaleDateString("en-IN", { month: "short" });

const buildCategoryData = (expenses) => {
  const totals = expenses.reduce((accumulator, expense) => {
    const currentTotal = accumulator[expense.category] || 0;
    accumulator[expense.category] = currentTotal + expense.amount;
    return accumulator;
  }, {});

  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value);
};

const buildMonthlyData = (expenses) => {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const current = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${current.getFullYear()}-${current.getMonth()}`,
      label: formatMonthLabel(current),
      amount: 0,
    };
  });

  const monthMap = months.reduce((accumulator, month) => {
    accumulator[month.key] = month;
    return accumulator;
  }, {});

  expenses.forEach((expense) => {
    const parsed = parseDate(expense.date);
    if (!parsed) {
      return;
    }

    const key = `${parsed.getFullYear()}-${parsed.getMonth()}`;
    if (monthMap[key]) {
      monthMap[key].amount += expense.amount;
    }
  });

  return months;
};

const buildTrendData = (expenses) => {
  const today = startOfDay(new Date());
  const points = Array.from({ length: TREND_DAYS }, (_, index) => {
    const current = new Date(today);
    current.setDate(today.getDate() - (TREND_DAYS - 1 - index));
    return {
      key: current.toISOString().slice(0, 10),
      label: formatShortDate(current),
      amount: 0,
    };
  });

  const pointMap = points.reduce((accumulator, point) => {
    accumulator[point.key] = point;
    return accumulator;
  }, {});

  expenses.forEach((expense) => {
    const parsed = parseDate(expense.date);
    if (!parsed) {
      return;
    }

    const key = startOfDay(parsed).toISOString().slice(0, 10);
    if (pointMap[key]) {
      pointMap[key].amount += expense.amount;
    }
  });

  return points;
};

const tooltipFormatter = (value) => currencyFormatter.format(Number(value || 0));

function Analytics() {
  const user = getAuthUser();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_BASE}/api/expenses`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Unable to load analytics right now.");
        }

        setExpenses(Array.isArray(data) ? data.map(normalizeExpense) : []);
      } catch (requestError) {
        setError(requestError.message || "Unable to load analytics right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const categoryData = useMemo(() => buildCategoryData(expenses), [expenses]);
  const monthlyData = useMemo(() => buildMonthlyData(expenses), [expenses]);
  const trendData = useMemo(() => buildTrendData(expenses), [expenses]);
  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );
  const averageExpense = expenses.length ? totalExpenses / expenses.length : 0;
  const highestCategory = categoryData[0] || null;

  const hasExpenses = expenses.length > 0;

  return (
    <div className="app-shell">
      <Sidebar user={user} />

      <div className="page-shell">
        <Navbar
          title="Analytics"
          subtitle="Understand where your money goes with category, monthly, and trend-based insights powered by your live backend data."
          actions={
            <span className="panel-badge">
              {loading ? "Refreshing..." : `${expenses.length} records`}
            </span>
          }
        />

        {error ? <div className="alert alert-error">{error}</div> : null}

        <div className="summary-grid analytics-summary-grid">
          <SummaryCard
            label="Total Expenses"
            value={currencyFormatter.format(totalExpenses)}
            helper="Combined spend across all tracked expenses"
            tone="primary"
          />
          <SummaryCard
            label="Highest Category"
            value={highestCategory ? highestCategory.name : "No data yet"}
            helper={
              highestCategory
                ? `${currencyFormatter.format(highestCategory.value)} spent in this category`
                : "Add expenses to reveal your top category"
            }
            tone="emerald"
          />
          <SummaryCard
            label="Average Expense"
            value={currencyFormatter.format(averageExpense)}
            helper="Average amount per recorded expense"
            tone="neutral"
          />
        </div>

        {!loading && !hasExpenses ? (
          <section className="panel analytics-empty-panel">
            <div className="empty-state analytics-empty-state">
              <h3>No analytics data yet</h3>
              <p className="muted-text">
                Add a few expenses from your dashboard and this page will automatically
                visualize category splits, monthly totals, and recent spending trends.
              </p>
            </div>
          </section>
        ) : (
          <div className="analytics-grid">
            <AnalyticsChartCard
              eyebrow="Category breakdown"
              title="Expenses by category"
              helper="See which categories consume the largest share of your spending."
            >
              {loading ? (
                <div className="empty-state">Preparing category insights...</div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={72}
                      outerRadius={118}
                      paddingAngle={2}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={tooltipFormatter} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </AnalyticsChartCard>

            <AnalyticsChartCard
              eyebrow="Monthly totals"
              title="Expenses by month"
              helper="A six-month view of how your spending moves over time."
            >
              {loading ? (
                <div className="empty-state">Preparing monthly totals...</div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d9e3ef" />
                    <XAxis dataKey="label" stroke="#617389" />
                    <YAxis stroke="#617389" tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                    <Tooltip formatter={tooltipFormatter} />
                    <Bar dataKey="amount" radius={[12, 12, 0, 0]} fill="#1f3f93" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </AnalyticsChartCard>

            <AnalyticsChartCard
              eyebrow="Recent trend"
              title={`Spending trend over the last ${TREND_DAYS} days`}
              helper="Track day-by-day momentum to spot spikes and calmer periods."
              className="analytics-chart-wide"
            >
              {loading ? (
                <div className="empty-state">Preparing daily trend...</div>
              ) : (
                <ResponsiveContainer width="100%" height={340}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d9e3ef" />
                    <XAxis
                      dataKey="label"
                      stroke="#617389"
                      minTickGap={24}
                    />
                    <YAxis
                      stroke="#617389"
                      tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                    />
                    <Tooltip formatter={tooltipFormatter} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#12957b"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </AnalyticsChartCard>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
