function SummaryCard({ label, value, helper, tone = "primary" }) {
  return (
    <article className={`summary-card tone-${tone}`}>
      <p className="summary-label">{label}</p>
      <h3>{value}</h3>
      <p className="summary-helper">{helper}</p>
    </article>
  );
}

export default SummaryCard;
