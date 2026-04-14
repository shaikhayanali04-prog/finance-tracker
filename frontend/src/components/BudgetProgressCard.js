import { useMemo } from "react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function BudgetProgressCard({ budget, expensesForCategory, onEdit, onDelete }) {
  const amountSpent = expensesForCategory.reduce((sum, exp) => sum + exp.amount, 0);
  const percentage = Math.min(100, Math.round((amountSpent / budget.amount) * 100));
  
  const isOverBudget = amountSpent > budget.amount;
  const isNearBudget = amountSpent > budget.amount * 0.8 && !isOverBudget;
  
  let progressClass = "progress-fill";
  if (isOverBudget) progressClass += " is-danger";
  else if (isNearBudget) progressClass += " is-warning";
  else progressClass += " is-success";

  return (
    <div className="panel budget-card">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{budget.month}</p>
          <h3 style={{ textTransform: "capitalize" }}>{budget.category}</h3>
        </div>
        <div className="budget-actions filter-inline" style={{ marginTop: 0 }}>
          <button type="button" className="button button-ghost" style={{ padding: '4px 8px' }} onClick={() => onEdit(budget)}>Edit</button>
          <button type="button" className="button button-secondary" style={{ padding: '4px 8px', color: '#dc2626', borderColor: '#fee2e2' }} onClick={() => onDelete(budget.id)}>Delete</button>
        </div>
      </div>
      
      <div className="budget-stats" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', marginTop: '1rem' }}>
        <div>
          <span className="muted-text">Spent</span>
          <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{currencyFormatter.format(amountSpent)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="muted-text">Budget</span>
          <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{currencyFormatter.format(budget.amount)}</div>
        </div>
      </div>

      <div className="progress-track" style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
        <div 
          className={progressClass} 
          style={{ width: `${percentage}%`, height: '100%', background: isOverBudget ? '#ef4444' : isNearBudget ? '#f59e0b' : '#10b981', transition: 'width 0.3s ease' }} 
        />
      </div>
      
      <p className="helper-text" style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: isOverBudget ? '#ef4444' : '#64748b' }}>
        {isOverBudget 
          ? `Over budget by ${currencyFormatter.format(amountSpent - budget.amount)}`
          : `${percentage}% of limit reached • ${currencyFormatter.format(budget.amount - amountSpent)} remaining`}
      </p>
    </div>
  );
}

export default BudgetProgressCard;
