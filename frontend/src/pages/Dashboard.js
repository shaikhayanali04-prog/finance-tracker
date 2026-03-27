import { useEffect, useState } from "react";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching expenses ❌");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense
  const addExpense = async () => {
    if (!title || !amount) {
      alert("Enter all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, amount })
      });

      if (res.ok) {
        setTitle("");
        setAmount("");
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    await fetch(`http://localhost:8081/api/expenses/${id}`, {
      method: "DELETE"
    });

    fetchExpenses();
  };

  // Total
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>💰 Finance Dashboard</h1>

      {/* SUMMARY CARD */}
      <div style={styles.card}>
        <h2>Total Expenses</h2>
        <h1 style={{ color: "green" }}>₹ {total}</h1>
      </div>

      {/* ADD FORM */}
      <div style={styles.card}>
        <h2>Add Expense</h2>

        <input
          style={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <button style={styles.button} onClick={addExpense}>
          Add Expense
        </button>
      </div>

      {/* TABLE */}
      <div style={styles.card}>
        <h2>All Expenses</h2>

        {expenses.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.title}</td>
                  <td>₹ {e.amount}</td>
                  <td>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteExpense(e.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* LOGOUT */}
      <button
        style={{ ...styles.button, background: "red" }}
        onClick={() => (window.location.href = "/")}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;

const styles = {
  container: {
    padding: "30px",
    background: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "Arial"
  },

  heading: {
    textAlign: "center"
  },

  card: {
    background: "white",
    padding: "20px",
    margin: "20px auto",
    maxWidth: "600px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },

  input: {
    display: "block",
    width: "95%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },

  button: {
    padding: "10px 20px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },

  deleteBtn: {
    padding: "5px 10px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  }
};