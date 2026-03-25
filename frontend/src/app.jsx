import { useState, useEffect } from "react";

const budgets = [
  { category: "Food", spent: 480, limit: 600, color: "#f59e0b" },
  { category: "Entertainment", spent: 120, limit: 200, color: "#8b5cf6" },
  { category: "Utilities", spent: 210, limit: 300, color: "#06b6d4" },
  { category: "Health", spent: 150, limit: 250, color: "#10b981" },
  { category: "Transport", spent: 95, limit: 150, color: "#f43f5e" },
];

const sparkData = [30, 55, 40, 80, 60, 75, 90, 65, 85, 95, 70, 100];

function AnimatedCounter({ value, prefix = "", suffix = "", decimals = 0 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    const duration = 1400;
    const step = end / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      {suffix}
    </span>
  );
}

function Sparkline({ data, color }) {
  const w = 120,
    h = 40;
  const max = Math.max(...data),
    min = Math.min(...data);

  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * (h - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#grad-${color})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FinanceTracker() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: "",
  });

  const [allTx, setAllTx] = useState([]);

  // ✅ Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/expenses");
      const data = await res.json();

      const mapped = data.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        amount: -Math.abs(item.amount),
        date: item.date,
        type: "expense",
        icon: "💳",
      }));

      setAllTx(mapped.reverse());
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalIncome = allTx
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const totalExpense = allTx
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Math.abs(b.amount), 0);

  const balance = totalIncome - totalExpense;

  const styles = {
    root: {
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#0a0c10",
      minHeight: "100vh",
      color: "#e2e8f0",
    },
    sidebar: {
      width: "72px",
      background: "#0d1117",
      borderRight: "1px solid #1e2532",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "24px 0",
      gap: "8px",
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
    },
    logo: {
      width: "40px",
      height: "40px",
      background: "linear-gradient(135deg, #d4a853, #f0c87a)",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      marginBottom: "24px",
    },
    navItem: (active) => ({
      width: "44px",
      height: "44px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "20px",
      transition: "all 0.2s",
      background: active ? "rgba(212,168,83,0.15)" : "transparent",
      border: active
        ? "1px solid rgba(212,168,83,0.3)"
        : "1px solid transparent",
    }),
    main: {
      marginLeft: "72px",
      padding: "32px",
      maxWidth: "1400px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "32px",
    },
    card: {
      background: "#0d1117",
      border: "1px solid #1e2532",
      borderRadius: "20px",
      padding: "24px",
    },
    balanceCard: {
      background: "linear-gradient(135deg, #1a1f2e 0%, #0f1420 100%)",
      border: "1px solid #2a3347",
      borderRadius: "24px",
      padding: "32px",
      position: "relative",
      overflow: "hidden",
    },
    badge: (color) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 600,
      background:
        color === "green"
          ? "rgba(16,185,129,0.15)"
          : color === "red"
          ? "rgba(244,63,94,0.15)"
          : "rgba(212,168,83,0.15)",
      color:
        color === "green"
          ? "#10b981"
          : color === "red"
          ? "#f43f5e"
          : "#d4a853",
    }),
    addBtn: {
      background: "linear-gradient(135deg, #d4a853, #f0c87a)",
      color: "#0a0c10",
      border: "none",
      borderRadius: "12px",
      padding: "10px 20px",
      fontWeight: 700,
      fontSize: "14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    modal: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
    },
    input: {
      width: "100%",
      background: "#0a0c10",
      border: "1px solid #2a3347",
      borderRadius: "10px",
      padding: "10px 14px",
      color: "#e2e8f0",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
    },
  };

  // ✅ Add Expense
  const handleAddTransaction = async () => {
    if (!form.title || !form.amount || !form.category || !form.date) {
      alert("Please fill all fields");
      return;
    }

    const expenseData = {
      title: form.title,
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
    };

    try {
      const res = await fetch("http://localhost:8081/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (res.ok) {
        setForm({
          title: "",
          amount: "",
          type: "expense",
          category: "Food",
          date: "",
        });
        setAddModal(false);
        fetchExpenses();
      } else {
        alert("Failed to add expense");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding expense");
    }
  };

  // ✅ Delete Expense
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/expenses/${id}`, {
        method: "DELETE",
      });
      fetchExpenses();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0c10; }
        .tx-row:hover { background: rgba(212,168,83,0.04) !important; }
      `}</style>

      <div style={styles.root}>
        <div style={styles.sidebar}>
          <div style={styles.logo}>₿</div>
          {[
            { id: "dashboard", icon: "⬡", label: "Dashboard" },
            { id: "transactions", icon: "⇄", label: "Transactions" },
            { id: "budget", icon: "◉", label: "Budget" },
          ].map((n) => (
            <div
              key={n.id}
              style={styles.navItem(activeTab === n.id)}
              onClick={() => setActiveTab(n.id)}
              title={n.label}
            >
              <span style={{ fontSize: "18px" }}>{n.icon}</span>
            </div>
          ))}
        </div>

        <div style={styles.main}>
          <div style={styles.header}>
            <div>
              <p style={{ fontSize: "12px", color: "#4b5563" }}>Overview</p>
              <h1 style={{ fontSize: "28px", fontWeight: 700 }}>
                Financial Dashboard
              </h1>
            </div>
            <button style={styles.addBtn} onClick={() => setAddModal(true)}>
              + Add Expense
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            <div style={styles.balanceCard}>
              <p style={{ fontSize: "11px", color: "#4b5563", marginBottom: "8px" }}>
                Net Balance
              </p>
              <h2 style={{ fontSize: "42px", fontWeight: 700 }}>
                ₹<AnimatedCounter value={balance} decimals={2} />
              </h2>
              <div style={{ marginTop: "20px" }}>
                <Sparkline data={sparkData} color="#d4a853" />
              </div>
            </div>

            <div style={styles.card}>
              <p style={{ fontSize: "11px", color: "#4b5563", marginBottom: "16px" }}>
                Total Income
              </p>
              <h3 style={{ fontSize: "28px", fontWeight: 700, color: "#10b981" }}>
                ₹<AnimatedCounter value={totalIncome} decimals={2} />
              </h3>
            </div>

            <div style={styles.card}>
              <p style={{ fontSize: "11px", color: "#4b5563", marginBottom: "16px" }}>
                Total Expenses
              </p>
              <h3 style={{ fontSize: "28px", fontWeight: 700, color: "#f43f5e" }}>
                ₹<AnimatedCounter value={totalExpense} decimals={2} />
              </h3>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={{ marginBottom: "20px" }}>Transactions</h3>

            {allTx.length === 0 ? (
              <p>No expenses found</p>
            ) : (
              allTx.map((tx) => (
                <div
                  key={tx.id}
                  className="tx-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px",
                    borderBottom: "1px solid #1e2532",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600 }}>{tx.title}</p>
                    <p style={{ fontSize: "12px", color: "#888" }}>
                      {tx.category} • {tx.date}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <span style={{ color: "#f43f5e", fontWeight: "bold" }}>
                      ₹{Math.abs(tx.amount)}
                    </span>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {addModal && (
          <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setAddModal(false)}>
            <div style={{ ...styles.card, width: "440px" }}>
              <h3 style={{ marginBottom: "20px" }}>Add Expense</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <input
                  style={styles.input}
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                <input
                  style={styles.input}
                  placeholder="Amount"
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />

                <input
                  style={styles.input}
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />

                <input
                  style={styles.input}
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />

                <button
                  style={{ ...styles.addBtn, justifyContent: "center", padding: "14px" }}
                  onClick={handleAddTransaction}
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}