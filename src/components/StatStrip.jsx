function StatStrip({ stats }) {
  return (
    <dl className="stat-strip">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt>{stat.label}</dt>
          <dd>{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default StatStrip;
