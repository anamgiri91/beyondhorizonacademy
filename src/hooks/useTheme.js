import { useEffect, useState } from "react";

export function useTheme() {
  const [darkTheme, setDarkTheme] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkTheme);

    if (darkTheme) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.removeItem("theme");
    }
  }, [darkTheme]);

  return {
    darkTheme,
    toggleTheme: () => setDarkTheme((current) => !current),
  };
}
