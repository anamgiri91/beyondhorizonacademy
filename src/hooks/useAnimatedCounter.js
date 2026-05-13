import { useEffect, useState } from "react";

export function useAnimatedCounter({ target, step = 10, intervalMs = 100, hourlyIncrease = 100 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const counter = window.setInterval(() => {
      setCount((current) => {
        if (current >= target) {
          window.clearInterval(counter);
          return target;
        }

        return Math.min(target, current + step);
      });
    }, intervalMs);

    const hourlyTimer = window.setInterval(() => {
      setCount((current) => current + hourlyIncrease);
    }, 3600000);

    return () => {
      window.clearInterval(counter);
      window.clearInterval(hourlyTimer);
    };
  }, [hourlyIncrease, intervalMs, step, target]);

  return count;
}
