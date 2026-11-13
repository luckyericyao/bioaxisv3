import { readBrowserStorage, removeBrowserStorage, writeBrowserStorage } from "./sourcingListStorage";

const requestIdStorageKey = "bioaxis:sourcing-request-id";
let browserRequestId: string | undefined;

export function isBioAxisRequestId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
}

function createRequestId() {
  const randomPart = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  return `BIOAXIS-${Date.now().toString(36).toUpperCase()}-${randomPart.slice(0, 12).toUpperCase()}`;
}

export function getBioAxisRequestId() {
  if (typeof window === "undefined") {
    return createRequestId();
  }

  if (browserRequestId) return browserRequestId;
  const stored = readBrowserStorage("sessionStorage", requestIdStorageKey).value;
  if (!isBioAxisRequestId(stored)) return rotateBioAxisRequestId();
  browserRequestId = stored;
  return browserRequestId;
}

export function rotateBioAxisRequestId() {
  const requestId = createRequestId();

  if (typeof window !== "undefined") {
    browserRequestId = requestId;
    if (!writeBrowserStorage("sessionStorage", requestIdStorageKey, requestId)) {
      removeBrowserStorage("sessionStorage", requestIdStorageKey);
    }
  }

  return requestId;
}

export function retireBioAxisRequestId(requestId: string) {
  if (typeof window !== "undefined" && getBioAxisRequestId() === requestId) {
    rotateBioAxisRequestId();
  }
}
