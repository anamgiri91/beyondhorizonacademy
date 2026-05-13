import { satResources } from "../data/siteData.js";
import { useAnimatedCounter } from "../hooks/useAnimatedCounter.js";

function About() {
  const userCount = useAnimatedCounter({ target: 500 });

  return (
    <>
      <section className="hero-section split-layout">
        <p className="user-count">{userCount} + Users</p>

        <div className="hero-media">
          <img src="/About.png" alt="Interactive online learning illustration" />
        </div>

        <div className="hero-copy">
          <p className="eyebrow">About Beyond Horizon Academy</p>
          <h1>Helping students learn with clarity and confidence</h1>
          <p>
            Beyond Horizon Academy supports SAT, NEB, and computer science learners with structured lessons,
            practice tools, and a roadmap toward active visualization.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>SAT Study Links</h2>
        <ul>
          {satResources.map((resource) => (
            <li key={resource.label}>
              <a href={resource.href} target="_blank" rel="noreferrer">
                {resource.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default About;
