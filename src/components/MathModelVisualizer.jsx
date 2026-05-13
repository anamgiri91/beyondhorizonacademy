import { useState } from "react";
import { mathVisualizationPresets } from "../data/interactiveContent.js";

function MathModelVisualizer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = mathVisualizationPresets[activeIndex];

  return (
    <section className="interactive-card">
      <div className="interactive-card__header">
        <p className="eyebrow">Math Model Visualizer</p>
        <h2>SAT Skill Models</h2>
        <span>Switch between common SAT math skill patterns.</span>
      </div>

      <div className="model-tabs">
        {mathVisualizationPresets.map((preset, index) => (
          <button
            key={preset.title}
            className={index === activeIndex ? "active" : ""}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            {preset.title}
          </button>
        ))}
      </div>

      <div className="model-display">
        <strong>{active.expression}</strong>
        <p>{active.detail}</p>
        <div className="model-meter">
          <span style={{ width: `${Math.min(active.result * 8, 100)}%` }} />
        </div>
        <p className="model-answer">Result: {active.result}</p>
      </div>
    </section>
  );
}

export default MathModelVisualizer;
