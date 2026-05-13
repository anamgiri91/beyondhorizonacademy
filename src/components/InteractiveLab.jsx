import CodeStepper from "./CodeStepper.jsx";
import DsaVisualizer from "./DsaVisualizer.jsx";
import GraphVisualizer from "./GraphVisualizer.jsx";
import MathVisualizations from "./MathVisualizations.jsx";
import MathModelVisualizer from "./MathModelVisualizer.jsx";
import SatPractice from "./SatPractice.jsx";

function InteractiveLab({ courseSlug }) {
  if (courseSlug === "math") {
    return (
      <section className="interactive-lab math-lab">
        <GraphVisualizer />
        <MathModelVisualizer />
        <MathVisualizations />
        <SatPractice type="math" />
      </section>
    );
  }

  if (courseSlug === "english") {
    return (
      <section className="interactive-lab single">
        <SatPractice type="english" />
      </section>
    );
  }

  if (courseSlug === "python") {
    return (
      <section className="interactive-lab single">
        <CodeStepper />
      </section>
    );
  }

  if (courseSlug === "dsa") {
    return (
      <section className="interactive-lab single">
        <DsaVisualizer />
      </section>
    );
  }

  return null;
}

export default InteractiveLab;
