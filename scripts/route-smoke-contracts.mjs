function renderedContent(html) {
  return html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g, "").replace(/<!--[\s\S]*?-->/g, "");
}

function label(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// Shared with offline rendering regressions so these smoke checks need no server.
export function noResultSearchFailures(html, expectedLabel, query, baseUrl) {
  const content = renderedContent(html);
  const main = content.match(/<main\b[^>]*>[\s\S]*<\/main>/)?.[0] ?? content;
  const actions = [...main.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map((match) => ({ url: new URL(match[1].replace(/&amp;/g, "&"), baseUrl), label: label(match[2]) }))
    .filter(({ url }) => url.pathname === "/request-quote");
  if (actions.length !== 1) return [`expected one no-result sourcing action, found ${actions.length}`];

  const failures = [];
  if (actions[0].label !== expectedLabel) failures.push(`expected no-result sourcing action "${expectedLabel}"`);
  for (const [key, value] of Object.entries({ type: "product-list", requestType: "product-list-review", query, q: query })) {
    if (actions[0].url.searchParams.get(key) !== value) failures.push(`no-result RFQ handoff must preserve ${key}`);
  }
  return failures;
}

export function headerNavigationFailures(html, menuOpen = false) {
  const header = renderedContent(html).match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0] ?? "";
  const menus = [...header.matchAll(/(<button\b[^>]*>)([\s\S]*?)<\/button>/g)]
    .filter((match) => /aria-label="(?:Menu|Close menu)"/.test(match[1]) || label(match[2]) === "Menu");
  const failures = [];
  if (menus.length !== 1 || !menus[0][1].includes(`aria-expanded="${menuOpen}"`)) {
    failures.push(`expected one Menu button with aria-expanded="${menuOpen}"`);
  }
  if (menuOpen && !menus[0]?.[1].includes('aria-controls="mobile-primary-navigation"')) {
    failures.push("expanded Menu button must control mobile-primary-navigation");
  }

  // Closed controls may omit aria-controls when their panels are unmounted.
  const ids = [...header.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  for (const match of header.matchAll(/\baria-controls="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) {
      if (ids.filter((value) => value === id).length !== 1) failures.push(`aria-controls must reference one rendered target: ${id}`);
    }
  }
  return failures;
}
