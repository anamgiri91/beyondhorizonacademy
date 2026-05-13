export const routes = {
  "/": "home",
  "/index.html": "home",
  "/home": "home",
  "/about": "about",
  "/courses": "courses",
  "/catalog": "courses",
  "/topics": "topics",
  "/sat": "sat",
  "/computer-science": "computerScience",
  "/tech-courses": "computerScience",
  "/python": "python",
  "/java": "java",
  "/dsa": "dsa",
  "/c": "c",
  "/js": "js",
  "/math": "math",
  "/english": "english",
  "/html": "html",
};

export function getPageFromPath(pathname) {
  return routes[pathname] ?? routes[pathname.toLowerCase()] ?? "home";
}
