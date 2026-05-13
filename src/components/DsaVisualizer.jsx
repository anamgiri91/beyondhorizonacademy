import { useMemo, useState } from "react";
import { dsaArray } from "../data/interactiveContent.js";

function buildBubbleSortSteps(values) {
  const arr = [...values];
  const steps = [{ array: [...arr], compare: [], note: "Start with the unsorted array." }];

  for (let pass = 0; pass < arr.length - 1; pass += 1) {
    for (let i = 0; i < arr.length - pass - 1; i += 1) {
      steps.push({
        array: [...arr],
        compare: [i, i + 1],
        note: `Compare ${arr[i]} and ${arr[i + 1]}.`,
      });

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        steps.push({
          array: [...arr],
          compare: [i, i + 1],
          note: "Swap because the left value is larger.",
        });
      }
    }
  }

  steps.push({ array: [...arr], compare: [], note: "Sorted array complete." });
  return steps;
}

function DsaVisualizer() {
  const steps = useMemo(() => buildBubbleSortSteps(dsaArray), []);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];

  function goNext() {
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  return (
    <section className="interactive-card">
      <div className="interactive-card__header">
        <p className="eyebrow">DSA Visualizer</p>
        <h2>Bubble Sort Stepper</h2>
        <span>Trace comparisons and swaps one step at a time.</span>
      </div>

      <div className="array-bars">
        {step.array.map((value, index) => (
          <div
            key={index}
            className={step.compare.includes(index) ? "array-bar active" : "array-bar"}
            style={{ height: `${value * 22}px` }}
          >
            {value}
          </div>
        ))}
      </div>

      <p className="step-note">{step.note}</p>

      <div className="lab-actions">
        <button className="lab-button secondary" type="button" onClick={goBack} disabled={stepIndex === 0}>
          Previous
        </button>
        <span>
          Step {stepIndex + 1} of {steps.length}
        </span>
        <button className="lab-button" type="button" onClick={goNext} disabled={stepIndex === steps.length - 1}>
          Next
        </button>
      </div>
    </section>
  );
}

export default DsaVisualizer;
