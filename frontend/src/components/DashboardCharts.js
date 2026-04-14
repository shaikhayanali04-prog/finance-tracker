import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#A28CF8", "#F472B6", "#A3E635"];

export default function DashboardCharts({ expenses, incomes }) {
  // Aggregate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const cat = expense.category || "General";
    acc[cat] = (acc[cat] || 0) + expense.amount;
    return acc;
  }, {});

  const pieData = Object.keys(expensesByCategory).map((key) => ({
    name: key,
    value: expensesByCategory[key],
  }));

  // Aggregate monthly data
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString("default", { month: "short", year: "numeric" });
    if (!acc[month]) acc[month] = { name: month, Income: 0, Expense: 0 };
    acc[month].Expense += expense.amount;
    return acc;
  }, {});

  incomes.forEach((income) => {
    const month = new Date(income.date).toLocaleString("default", { month: "short", year: "numeric" });
    if (!monthlyData[month]) monthlyData[month] = { name: month, Income: 0, Expense: 0 };
    monthlyData[month].Income += income.amount;
  });

  const barData = Object.values(monthlyData).sort((a, b) => new Date(a.name) - new Date(b.name));

  return (
    <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
      <motion.div 
        className="panel chart-panel neumorphic-glass"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <p className="eyebrow">Overview</p>
          <h3>Expenses by Category</h3>
        </div>
        <div style={{ height: 300, width: "100%" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="rgba(255,255,255,0.1)"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        className="panel chart-panel neumorphic-glass"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <p className="eyebrow">Cashflow</p>
          <h3>Income vs Expenses</h3>
        </div>
        <div style={{ height: 300, width: "100%" }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: "0.8rem" }} />
              <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: "0.8rem" }} />
              <Tooltip 
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
              />
              <Legend />
              <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
