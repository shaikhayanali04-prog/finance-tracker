import { useEffect, useMemo, useState } from "react";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const normalizeExpense = (expense) => ({
    ...expense,
    title: expense?.title ?? expense?.description ?? "",
    description: expense?.description ?? expense?.title ?? "",
    category: expense?.category ?? "General",
    date: expense?.date ?? "",
    amount: Number(expense?.amount ?? 0),
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/expenses");
        if (!res.ok) {
          throw new Error(`Failed to fetch expenses: ${res.status}`);
        }

        const data = await res.json();
        setExpenses(Array.isArray(data) ? data.map(normalizeExpense) : []);
      } catch (err) {
        console.error(err);
        alert("Error fetching expenses");
      }
    };

    fetchExpenses();
  }, []);

  const addExpense = async () => {
    if (!title || !amount) {
      alert("Enter all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          category: "General",
          description: title,
          date: new Date().toISOString().slice(0, 10),
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to add expense: ${res.status}`);
      }

      setTitle("");
      setAmount("");
      setShowModal(false);
      const updatedExpenses = await fetch("http://localhost:8081/api/expenses");
      if (!updatedExpenses.ok) {
        throw new Error(`Failed to refresh expenses: ${updatedExpenses.status}`);
      }
      const data = await updatedExpenses.json();
      setExpenses(Array.isArray(data) ? data.map(normalizeExpense) : []);
    } catch (err) {
      console.error(err);
      alert("Error adding expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      const res = await fetch(`http://localhost:8081/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete expense: ${res.status}`);
      }

      const updatedExpenses = await fetch("http://localhost:8081/api/expenses");
      if (!updatedExpenses.ok) {
        throw new Error(`Failed to refresh expenses: ${updatedExpenses.status}`);
      }
      const data = await updatedExpenses.json();
      setExpenses(Array.isArray(data) ? data.map(normalizeExpense) : []);
    } catch (err) {
      console.error(err);
      alert("Error deleting expense");
    }
  };

  const filteredExpenses = useMemo(() => {
    const query = search.toLowerCase();

    return expenses.filter((expense) => {
      const searchableText = [
        expense.title,
        expense.description,
        expense.category,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [expenses, search]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = 50000;
  const totalBalance = totalIncome - totalExpenses;
  const avgExpense = expenses.length
    ? Math.round(totalExpenses / expenses.length)
    : 0;

  const chartData = [40, 65, 55, 85, 45, 70];

  return (
    <div className="bg-[#f6fafe] text-[#171c1f] min-h-screen font-sans flex">
      <aside className="bg-slate-50 h-screen w-72 flex-col sticky top-0 left-0 py-8 px-4 shrink-0 overflow-y-auto border-r border-slate-200 hidden lg:flex">
        <div className="mb-10 px-4">
          <h1 className="text-2xl font-black tracking-tight text-[#2E3192]">
            Trakify
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Personal Finance Tracker
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-4 px-6 py-3 bg-[#86f2e4] text-[#006f66] rounded-full font-bold text-left">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </button>

          <button className="w-full flex items-center gap-4 px-6 py-3 text-slate-500 hover:text-[#2E3192] hover:bg-slate-200/50 transition-colors rounded-full font-medium text-left">
            <span className="material-symbols-outlined">receipt_long</span>
            <span>Transactions</span>
          </button>

          <button className="w-full flex items-center gap-4 px-6 py-3 text-slate-500 hover:text-[#2E3192] hover:bg-slate-200/50 transition-colors rounded-full font-medium text-left">
            <span className="material-symbols-outlined">
              account_balance_wallet
            </span>
            <span>Budgets</span>
          </button>

          <button className="w-full flex items-center gap-4 px-6 py-3 text-slate-500 hover:text-[#2E3192] hover:bg-slate-200/50 transition-colors rounded-full font-medium text-left">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 px-4 space-y-6">
          <div className="bg-[#363386] p-5 rounded-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[#a2a0fa] text-xs font-bold mb-2 uppercase tracking-widest">
                Premium Tier
              </p>
              <p className="text-white font-bold text-sm mb-4 leading-snug">
                Unlock predictive financial insights with AI.
              </p>
              <button className="bg-[#86f2e4] text-[#006f66] px-4 py-2 rounded-xl text-xs font-bold w-full">
                Upgrade Now
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2">
            <img
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
              src="https://i.pravatar.cc/100?img=12"
            />
            <div>
              <p className="text-sm font-bold">Ayan</p>
              <p className="text-[10px] text-slate-500 font-medium">
                Free Member
              </p>
            </div>
          </div>

          <button className="flex items-center gap-4 px-6 py-3 text-slate-500 hover:text-[#2E3192] transition-colors">
            <span className="material-symbols-outlined">help</span>
            <span className="text-sm">Help Center</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden flex flex-col">
        <header className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center px-4 md:px-8 py-4 sticky top-0 z-40 bg-white/80 backdrop-blur-xl rounded-2xl mt-4 mx-4 md:mx-6 shadow-[0px_24px_48px_rgba(31,26,111,0.06)]">
          <div className="flex items-center bg-[#f0f4f8] px-4 py-2 rounded-xl w-full md:w-96 border border-slate-200">
            <span className="material-symbols-outlined text-slate-500 text-xl">
              search
            </span>
            <input
              className="bg-transparent border-none outline-none text-sm w-full ml-2 placeholder:text-slate-400"
              placeholder="Search expenses..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f0f4f8] text-[#1f1a6f] hover:bg-slate-200 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f0f4f8] text-[#1f1a6f] hover:bg-slate-200 transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>

            <div className="h-8 w-px bg-slate-300 mx-2 hidden md:block"></div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-[#1f1a6f] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#363386] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Expense
            </button>

            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-8">
          <section>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1f1a6f]">
              Good morning, Ayan
            </h2>
            <p className="text-slate-500 mt-1 font-medium">
              Your financial health is looking{" "}
              <span className="text-[#006a61] font-bold">Excellent</span> this
              month.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              {
                title: "Total Balance",
                amount: `Rs ${totalBalance}`,
                extra: "Current available amount",
                color: "text-[#006a61]",
                icon: "account_balance_wallet",
              },
              {
                title: "Total Income",
                amount: `Rs ${totalIncome}`,
                extra: "Fixed demo income",
                color: "text-[#006a61]",
                icon: "north_east",
              },
              {
                title: "Total Expenses",
                amount: `Rs ${totalExpenses}`,
                extra: `${expenses.length} expenses added`,
                color: "text-red-500",
                icon: "south_east",
              },
              {
                title: "Avg Expense",
                amount: `Rs ${avgExpense}`,
                extra: "Average per transaction",
                color: "text-slate-500",
                icon: "timer",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-[1.5rem] shadow-[0px_24px_48px_rgba(31,26,111,0.06)]"
              >
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-extrabold text-[#1f1a6f] tracking-tight">
                  {card.amount}
                </p>
                <div
                  className={`mt-6 flex items-center gap-2 font-bold text-sm ${card.color}`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {card.icon}
                  </span>
                  <span>{card.extra}</span>
                </div>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-[1.5rem] shadow-[0px_24px_48px_rgba(31,26,111,0.06)]">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-xl font-bold text-[#1f1a6f]">
                    Expense Analytics
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    Visualization of spending flow across last 6 months
                  </p>
                </div>
              </div>

              <div className="h-64 flex items-end gap-3">
                {chartData.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2 justify-end h-full"
                  >
                    <div
                      className={`w-full rounded-t-xl ${
                        i === 3 ? "bg-[#86f2e4]" : "bg-slate-200"
                      }`}
                      style={{ height: `${h}%` }}
                    ></div>
                    <span
                      className={`text-[10px] font-bold ${
                        i === 3 ? "text-[#006a61]" : "text-slate-500"
                      }`}
                    >
                      {["JAN", "FEB", "MAR", "APR", "MAY", "JUN"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white p-8 rounded-[1.5rem] shadow-[0px_24px_48px_rgba(31,26,111,0.06)] flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-[#1f1a6f]">
                    Budget Status
                  </h3>
                  <button className="text-[#006a61] text-sm font-bold">
                    Manage
                  </button>
                </div>

                <div className="space-y-8">
                  {[
                    {
                      name: "Food & Dining",
                      value: "Rs 850 / Rs 1,200",
                      width: "70%",
                      color: "bg-[#006a61]",
                    },
                    {
                      name: "Rent & Utilities",
                      value: "Rs 2,100 / Rs 2,100",
                      width: "100%",
                      color: "bg-[#1f1a6f]",
                    },
                    {
                      name: "Entertainment",
                      value: "Rs 120 / Rs 500",
                      width: "24%",
                      color: "bg-[#22beab]",
                    },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold">{item.name}</span>
                        <span className="text-xs text-slate-500">
                          {item.value}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: item.width }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section className="bg-white rounded-[1.5rem] shadow-[0px_24px_48px_rgba(31,26,111,0.06)] overflow-hidden">
            <div className="px-8 py-6 flex justify-between items-center border-b border-slate-200">
              <h3 className="text-xl font-bold text-[#1f1a6f]">
                Recent Expenses
              </h3>
              <button className="bg-[#f0f4f8] text-[#1f1a6f] px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">
                Total: {filteredExpenses.length}
              </button>
            </div>

            <div className="overflow-x-auto">
              {filteredExpenses.length === 0 ? (
                <p className="p-8 text-slate-500">No expenses found.</p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                      <th className="px-8 py-4">Title</th>
                      <th className="px-8 py-4">Category</th>
                      <th className="px-8 py-4">Date</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Amount</th>
                      <th className="px-8 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredExpenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-8 py-5 font-bold">
                          {expense.title || "Untitled expense"}
                        </td>
                        <td className="px-8 py-5">
                          {expense.category || "General"}
                        </td>
                        <td className="px-8 py-5 text-slate-500">
                          {expense.date || "No date"}
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-bold text-[#006a61]">
                            Completed
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right font-extrabold text-[#1f1a6f]">
                          -Rs {expense.amount}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600"
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
          </section>
        </div>

        <footer className="mt-auto p-8 text-center text-slate-500 text-xs font-medium">
          (c) 2026 Trakify Financial Systems
        </footer>
      </main>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-[#1f1a6f] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-all z-50"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1f1a6f]">
                Add Expense
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-black"
              >
                X
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Expense title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-[#1f1a6f]"
              />

              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-[#1f1a6f]"
              />

              <button
                onClick={addExpense}
                className="w-full bg-[#1f1a6f] text-white py-3 rounded-xl font-bold hover:bg-[#363386]"
              >
                Save Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
