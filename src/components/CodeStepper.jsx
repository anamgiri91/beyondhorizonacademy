import { useState } from "react";
import { pythonSteps } from "../data/interactiveContent.js";

function CodeStepper() {
  const [stepIndex, setStepIndex] = useState(0);
  const activeStep = pythonSteps[stepIndex];

  return (
    <section className="interactive-card">
      <div className="interactive-card__header">
        <p className="eyebrow">Code Stepper</p>
        <h2>Python Execution Trace</h2>
        <span>Move through code one line at a time.</span>
      </div>

      <div className="code-stepper">
        <pre>
          {pythonSteps.map((step, index) => (
            <code key={step.line} className={index === stepIndex ? "active-line" : ""}>
              {index + 1}. {step.line}
              {"\n"}
            </code>
          ))}
        </pre>

        <div className="runtime-panel">
          <h3>What happens now?</h3>
          <p>{activeStep.output}</p>
          <strong>Memory</strong>
          <span>{activeStep.memory}</span>
        </div>
      </div>

      <div className="lab-actions">
        <button className="lab-button secondary" type="button" onClick={() => setStepIndex((current) => Math.max(current - 1, 0))} disabled={stepIndex === 0}>
          Previous
        </button>
        <span>
          Line {stepIndex + 1} of {pythonSteps.length}
        </span>
        <button className="lab-button" type="button" onClick={() => setStepIndex((current) => Math.min(current + 1, pythonSteps.length - 1))} disabled={stepIndex === pythonSteps.length - 1}>
          Next
        </button>
      </div>
    </section>
  );
}

export default CodeStepper;
