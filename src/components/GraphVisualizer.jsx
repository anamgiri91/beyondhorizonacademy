import { useMemo, useState } from "react";

const width = 420;
const height = 300;
const origin = { x: width / 2, y: height / 2 };
const unit = 26;

function toPoint(x, y) {
  return {
    x: origin.x + x * unit,
    y: origin.y - y * unit,
  };
}

function GraphVisualizer() {
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(0);

  const line = useMemo(() => {
    const x1 = -7;
    const x2 = 7;
    const y1 = slope * x1 + intercept;
    const y2 = slope * x2 + intercept;
    return { start: toPoint(x1, y1), end: toPoint(x2, y2) };
  }, [intercept, slope]);

  const samplePoint = toPoint(2, slope * 2 + intercept);

  return (
    <section className="interactive-card">
      <div className="interactive-card__header">
        <p className="eyebrow">Graph Visualizer</p>
        <h2>Explore y = mx + b</h2>
        <span>Change slope and intercept to see how a line moves.</span>
      </div>

      <div className="graph-layout">
        <svg className="graph-canvas" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Coordinate graph">
          {Array.from({ length: 15 }, (_, index) => {
            const offset = (index - 7) * unit;
            return (
              <g key={offset}>
                <line x1={origin.x + offset} y1="0" x2={origin.x + offset} y2={height} />
                <line x1="0" y1={origin.y + offset} x2={width} y2={origin.y + offset} />
              </g>
            );
          })}
          <line className="axis" x1="0" y1={origin.y} x2={width} y2={origin.y} />
          <line className="axis" x1={origin.x} y1="0" x2={origin.x} y2={height} />
          <line className="function-line" x1={line.start.x} y1={line.start.y} x2={line.end.x} y2={line.end.y} />
          <circle className="sample-point" cx={samplePoint.x} cy={samplePoint.y} r="6" />
        </svg>

        <div className="control-panel">
          <label>
            Slope: {slope}
            <input type="range" min="-3" max="3" step="0.5" value={slope} onChange={(event) => setSlope(Number(event.target.value))} />
          </label>
          <label>
            Intercept: {intercept}
            <input type="range" min="-5" max="5" step="1" value={intercept} onChange={(event) => setIntercept(Number(event.target.value))} />
          </label>
          <p>
            At x = 2, y = {slope} x 2 + {intercept} = {slope * 2 + intercept}.
          </p>
        </div>
      </div>
    </section>
  );
}

export default GraphVisualizer;
