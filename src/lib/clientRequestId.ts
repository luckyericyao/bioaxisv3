const requestIdStorageKey = "bioaxis:sourcing-request-id";

function createRequestId() {
  const randomPart = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  return `BIOAXIS-${Date.now().toString(36).toUpperCase()}-${randomPart.slice(0, 12).toUpperCase()}`;
}

export function getBioAxisRequestId() {
  if (typeof window === "undefined") {
    return createRequestId();
  }

  try {
    const existing = window.sessionStorage.getItem(requestIdStorageKey);
    if (existing) {
      return existing;
    }

    const requestId = createRequestId();
    window.sessionStorage.setItem(requestIdStorageKey, requestId);
    return requestId;
  } catch {
    return createRequestId();
  }
}

export function rotateBioAxisRequestId() {
  const requestId = createRequestId();

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(requestIdStorageKey, requestId);
    } catch {
      // Session storage can be unavailable in privacy-restricted browsers.
    }
  }

  return requestId;
}
