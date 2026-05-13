import { useEffect, useMemo, useState } from "react";
import { fetchLearningAnalytics } from "../api/api.js";

const graph = {
  width: 520,
  height: 340,
  originX: 260,
  originY: 170,
  unit: 28,
};

function toPoint(x, y) {
  return {
    x: graph.originX + x * graph.unit,
    y: graph.originY - y * graph.unit,
  };
}

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function GraphGrid({ children, label }) {
  return (
    <svg className="math-viz-graph" viewBox={`0 0 ${graph.width} ${graph.height}`} role="img" aria-label={label}>
      {Array.from({ length: 19 }, (_, index) => {
        const offset = (index - 9) * graph.unit;
        return (
          <g key={offset}>
            <line x1={graph.originX + offset} y1="0" x2={graph.originX + offset} y2={graph.height} />
            <line x1="0" y1={graph.originY + offset} x2={graph.width} y2={graph.originY + offset} />
          </g>
        );
      })}
      <line className="axis" x1="0" y1={graph.originY} x2={graph.width} y2={graph.originY} />
      <line className="axis" x1={graph.originX} y1="0" x2={graph.originX} y2={graph.height} />
      {children}
    </svg>
  );
}

function Slider({ label, value, min, max, step, onChange }) {
  return (
    <label>
      <span>{label}: {formatNumber(value)}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function QuadraticExplorer() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);

  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  const roots = discriminant >= 0
    ? [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)]
    : [];

  const curve = useMemo(() => {
    const points = [];
    for (let x = -8; x <= 8; x += 0.25) {
      const y = a * x * x + b * x + c;
      points.push(toPoint(x, y));
    }
    return points.map((point) => `${point.x},${point.y}`).join(" ");
  }, [a, b, c]);

  return (
    <section className="interactive-card math-viz-card">
      <div className="interactive-card__header">
        <p className="eyebrow">Quadratic Parabola Explorer</p>
        <h2>Explore y = ax² + bx + c</h2>
        <span>Move each coefficient and watch the vertex, roots, and opening direction update live.</span>
      </div>
      <GraphGrid label="Quadratic graph">
        <polyline className="parabola-line" points={curve} />
        <circle className="vertex-point" cx={toPoint(vertexX, vertexY).x} cy={toPoint(vertexX, vertexY).y} r="7" />
        {roots.map((root) => (
          <circle className="root-point" key={root} cx={toPoint(root, 0).x} cy={toPoint(root, 0).y} r="6" />
        ))}
      </GraphGrid>
      <div className="viz-controls">
        <Slider label="a" value={a} min="-3" max="3" step="0.5" onChange={(value) => setA(value === 0 ? 0.5 : value)} />
        <Slider label="b" value={b} min="-8" max="8" step="1" onChange={setB} />
        <Slider label="c" value={c} min="-8" max="8" step="1" onChange={setC} />
      </div>
      <div className="viz-metrics">
        <span>Vertex: ({formatNumber(vertexX)}, {formatNumber(vertexY)})</span>
        <span>{roots.length ? `Roots: ${roots.map(formatNumber).join(", ")}` : "No real roots"}</span>
        <span>{a > 0 ? "Opens upward" : "Opens downward"}</span>
      </div>
    </section>
  );
}

function SystemsVisualizer() {
  const [m1, setM1] = useState(1);
  const [b1, setB1] = useState(1);
  const [m2, setM2] = useState(-1);
  const [b2, setB2] = useState(5);
  const parallel = m1 === m2;
  const x = parallel ? 0 : (b2 - b1) / (m1 - m2);
  const y = m1 * x + b1;

  function linePoints(m, intercept) {
    const x1 = -9;
    const x2 = 9;
    return {
      start: toPoint(x1, m * x1 + intercept),
      end: toPoint(x2, m * x2 + intercept),
    };
  }

  const lineA = linePoints(m1, b1);
  const lineB = linePoints(m2, b2);

  return (
    <section className="interactive-card math-viz-card">
      <div className="interactive-card__header">
        <p className="eyebrow">System of Equations Visualizer</p>
        <h2>Intersection = solution</h2>
        <span>Adjust two lines and see why solving a system means finding the point both equations share.</span>
      </div>
      <GraphGrid label="System of equations graph">
        <line className="system-line one" x1={lineA.start.x} y1={lineA.start.y} x2={lineA.end.x} y2={lineA.end.y} />
        <line className="system-line two" x1={lineB.start.x} y1={lineB.start.y} x2={lineB.end.x} y2={lineB.end.y} />
        {!parallel ? <circle className="intersection-point" cx={toPoint(x, y).x} cy={toPoint(x, y).y} r="7" /> : null}
      </GraphGrid>
      <div className="viz-controls two-column">
        <Slider label="Line 1 slope" value={m1} min="-3" max="3" step="0.5" onChange={setM1} />
        <Slider label="Line 1 intercept" value={b1} min="-6" max="6" step="1" onChange={setB1} />
        <Slider label="Line 2 slope" value={m2} min="-3" max="3" step="0.5" onChange={setM2} />
        <Slider label="Line 2 intercept" value={b2} min="-6" max="6" step="1" onChange={setB2} />
      </div>
      <div className="viz-metrics">
        <span>y = {formatNumber(m1)}x + {formatNumber(b1)}</span>
        <span>y = {formatNumber(m2)}x + {formatNumber(b2)}</span>
        <span>{parallel ? "Parallel lines: no solution" : `Solution: (${formatNumber(x)}, ${formatNumber(y)})`}</span>
      </div>
    </section>
  );
}

function GeometryBuilder() {
  const [base, setBase] = useState(6);
  const [height, setHeight] = useState(4);
  const hypotenuse = Math.sqrt(base * base + height * height);
  const angle = Math.atan(height / base) * (180 / Math.PI);
  const scale = 34;
  const start = { x: 76, y: 250 };
  const end = { x: start.x + base * scale, y: start.y };
  const top = { x: start.x + base * scale, y: start.y - height * scale };

  return (
    <section className="interactive-card math-viz-card">
      <div className="interactive-card__header">
        <p className="eyebrow">Geometry Shape Builder</p>
        <h2>Build a right triangle</h2>
        <span>Change the legs and watch the Pythagorean relationship stay true.</span>
      </div>
      <svg className="geometry-canvas" viewBox="0 0 440 300" role="img" aria-label="Right triangle builder">
        <polygon points={`${start.x},${start.y} ${end.x},${end.y} ${top.x},${top.y}`} />
        <path d={`M ${end.x - 32} ${end.y} L ${end.x - 32} ${end.y - 32} L ${end.x} ${end.y - 32}`} />
        <text x={(start.x + end.x) / 2 - 18} y={start.y + 28}>a = {base}</text>
        <text x={end.x + 12} y={(end.y + top.y) / 2}>b = {height}</text>
        <text x={(start.x + top.x) / 2 - 22} y={(start.y + top.y) / 2 - 12}>c = {formatNumber(hypotenuse)}</text>
      </svg>
      <div className="viz-controls">
        <Slider label="Base a" value={base} min="2" max="9" step="1" onChange={setBase} />
        <Slider label="Height b" value={height} min="2" max="7" step="1" onChange={setHeight} />
      </div>
      <div className="viz-metrics">
        <span>{base}² + {height}² = {formatNumber(hypotenuse)}²</span>
        <span>Area: {formatNumber((base * height) / 2)}</span>
        <span>Base angle: {formatNumber(angle)}°</span>
      </div>
    </section>
  );
}

function ScoreTrendChart({ data }) {
  const fallback = [
    { date: "Start", estimated_score: 1040 },
    { date: "Week 1", estimated_score: 1120 },
    { date: "Week 2", estimated_score: 1210 },
    { date: "Now", estimated_score: 1320 },
  ];
  const points = data?.length ? data : fallback;
  const min = Math.min(...points.map((point) => point.estimated_score), 900);
  const max = Math.max(...points.map((point) => point.estimated_score), 1500);
  const chartWidth = 520;
  const chartHeight = 230;
  const plot = points.map((point, index) => {
    const x = 34 + (index / Math.max(points.length - 1, 1)) * (chartWidth - 68);
    const y = chartHeight - 32 - ((point.estimated_score - min) / Math.max(max - min, 1)) * (chartHeight - 64);
    return { ...point, x, y };
  });

  return (
    <section className="interactive-card math-viz-card">
      <div className="interactive-card__header">
        <p className="eyebrow">Score Progress Over Time</p>
        <h2>Practice score trend</h2>
        <span>{data?.length ? "Built from your backend attempts." : "Sign in and submit answers to replace this demo trend with real data."}</span>
      </div>
      <svg className="analytics-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Score progress line chart">
        <polyline points={plot.map((point) => `${point.x},${point.y}`).join(" ")} />
        {plot.map((point) => (
          <g key={point.date}>
            <circle cx={point.x} cy={point.y} r="6" />
            <text x={point.x - 20} y={point.y - 14}>{point.estimated_score}</text>
          </g>
        ))}
      </svg>
    </section>
  );
}

function WeakAreasDonut({ data }) {
  const fallback = [
    { topic: "Algebra", wrong: 6 },
    { topic: "Geometry", wrong: 4 },
    { topic: "Advanced Math", wrong: 3 },
    { topic: "Data Analysis", wrong: 2 },
  ];
  const rows = (data?.length ? data : fallback).slice(0, 5);
  const total = rows.reduce((sum, row) => sum + (row.wrong || 1), 0);
  let cumulative = 0;

  return (
    <section className="interactive-card math-viz-card">
      <div className="interactive-card__header">
        <p className="eyebrow">Weak Areas Breakdown</p>
        <h2>Wrong answers by topic</h2>
        <span>{data?.length ? "Uses backend attempt history." : "Demo breakdown until you sign in and answer questions."}</span>
      </div>
      <div className="donut-layout">
        <svg className="donut-chart" viewBox="0 0 42 42" role="img" aria-label="Weak areas donut chart">
          <circle className="donut-base" cx="21" cy="21" r="15.915" />
          {rows.map((row, index) => {
            const value = row.wrong || 1;
            const dash = (value / total) * 100;
            const segment = (
              <circle
                className={`donut-segment segment-${index}`}
                cx="21"
                cy="21"
                r="15.915"
                strokeDasharray={`${dash} ${100 - dash}`}
                strokeDashoffset={25 - cumulative}
              />
            );
            cumulative += dash;
            return <g key={row.topic}>{segment}</g>;
          })}
        </svg>
        <div className="donut-legend">
          {rows.map((row, index) => (
            <span key={row.topic}>
              <i className={`segment-${index}`} />
              {row.topic}: {Math.round((row.percent_wrong ?? row.wrong / total) * 100)}%
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function MathVisualizations() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      try {
        const result = await fetchLearningAnalytics();
        if (active) {
          setAnalytics(result);
        }
      } catch {
        if (active) {
          setAnalytics(null);
        }
      }
    }

    loadAnalytics();
    window.addEventListener("bha-auth-change", loadAnalytics);

    return () => {
      active = false;
      window.removeEventListener("bha-auth-change", loadAnalytics);
    };
  }, []);

  return (
    <section className="math-viz-suite">
      <QuadraticExplorer />
      <GeometryBuilder />
      <SystemsVisualizer />
      <ScoreTrendChart data={analytics?.score_trend} />
      <WeakAreasDonut data={analytics?.weak_areas} />
    </section>
  );
}

export default MathVisualizations;
