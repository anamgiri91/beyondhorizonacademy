import { useEffect, useState } from "react";
import { getPageFromPath } from "../data/routes.js";

export function useRoute() {
  const [page, setPage] = useState(() => getPageFromPath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPage(getPageFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(href) {
    window.history.pushState({}, "", href);
    setPage(getPageFromPath(window.location.pathname));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return { page, navigate };
}
