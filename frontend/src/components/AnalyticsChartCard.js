function AnalyticsChartCard({ eyebrow, title, helper, children, className = "" }) {
  const combinedClassName = `panel analytics-chart-card ${className}`.trim();

  return (
    <section className={combinedClassName}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
        </div>
      </div>
      {helper ? <p className="muted-text analytics-chart-helper">{helper}</p> : null}
      <div className="analytics-chart-body">{children}</div>
    </section>
  );
}

export default AnalyticsChartCard;
