export function isExternalLink(href) {
  return /^https?:\/\//i.test(href);
}

export function normalizeInternalHref(href) {
  if (!href || href.startsWith("/") || isExternalLink(href) || href.startsWith("#")) {
    return href;
  }

  return `/${href.replace(/\.html$/i, "")}`;
}

export function handleInternalLinkClick(event, navigate) {
  const href = event.currentTarget.getAttribute("href");

  if (!href || isExternalLink(href) || href.startsWith("#")) {
    return;
  }

  event.preventDefault();
  navigate(normalizeInternalHref(href));
}
