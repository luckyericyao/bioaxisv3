"use client";

import { RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TurnstileRenderOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let pendingTurnstileScript: Promise<TurnstileApi> | undefined;

function loadTurnstileApi() {
  if (pendingTurnstileScript) return pendingTurnstileScript;

  // Share one SDK request across forms, but do not cache a failed load.
  pendingTurnstileScript = new Promise<TurnstileApi>((resolve, reject) => {
    const script = typeof window.turnstile?.render === "function" ? null : document.createElement("script");
    let finished = false;
    const finish = (api?: TurnstileApi) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      if (script) script.onload = script.onerror = null;
      if (api) resolve(api);
      else {
        script?.remove();
        reject(new Error("Verification script unavailable"));
      }
    };
    const timeout = window.setTimeout(() => finish(), 8000);
    function afterLoad() {
      // The async SDK exposes render after load; ready can throw in this mode.
      const api = window.turnstile;
      finish(typeof api?.render === "function" ? api : undefined);
    }

    if (script) {
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = afterLoad;
      script.onerror = () => finish();
      document.head.appendChild(script);
    } else {
      afterLoad();
    }
  }).finally(() => { pendingTurnstileScript = undefined; });

  return pendingTurnstileScript;
}

type TurnstileWidgetProps = {
  onTokenChange: (token: string) => void;
  onAvailabilityChange?: (available: boolean) => void;
  onFailure?: (reason: string) => void;
  compact?: boolean;
  resetKey?: number;
};

type TurnstileConfigResponse = {
  enabled?: boolean;
  siteKey?: string;
};

type TurnstileConfigState = "loading" | "ready" | "disabled" | "error";

export function TurnstileWidget({ onTokenChange, onAvailabilityChange, onFailure, compact = false, resetKey = 0 }: TurnstileWidgetProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [siteKey, setSiteKey] = useState("");
  const [configState, setConfigState] = useState<TurnstileConfigState>("loading");
  const [configAttempt, setConfigAttempt] = useState(0);
  const [widgetAttempt, setWidgetAttempt] = useState(0);
  const [widgetLoading, setWidgetLoading] = useState(true);
  const [widgetIssue, setWidgetIssue] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);

    async function loadRuntimeConfig() {
      try {
        const response = await fetch("/api/turnstile/config", { cache: "no-store", signal: controller.signal });

        if (!response.ok) {
          throw new Error("Turnstile configuration unavailable");
        }

        const config = (await response.json()) as TurnstileConfigResponse;

        if (!ignore) {
          if (config.enabled === true && typeof config.siteKey === "string" && config.siteKey.trim()) {
            setSiteKey(config.siteKey);
            setConfigState("ready");
            onAvailabilityChange?.(true);
          } else if (config.enabled === false && !config.siteKey) {
            setSiteKey("");
            setConfigState("disabled");
            onAvailabilityChange?.(false);
          } else {
            throw new Error("Invalid Turnstile configuration");
          }
        }
      } catch {
        if (!ignore) {
          setSiteKey("");
          setConfigState("error");
          onAvailabilityChange?.(true);
          onFailure?.("config_error");
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }

    loadRuntimeConfig();

    return () => {
      ignore = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [configAttempt, onAvailabilityChange, onFailure]);

  useEffect(() => {
    const container = containerRef.current;
    if (!siteKey || !container) return;

    let active = true;
    let sdk: TurnstileApi | undefined;
    function handleFailure(reason: string, message: string) {
      if (!active) return;
      onTokenChange("");
      setVerificationStatus("");
      setWidgetLoading(false);
      setWidgetIssue(message);
      onFailure?.(reason);
    }

    void loadTurnstileApi().then((api) => {
      if (!active) return;
      sdk = api;
      widgetIdRef.current = api.render(container, {
        sitekey: siteKey,
        theme: "light",
        size: compact ? "compact" : "normal",
        callback: (token) => {
          if (!active) return;
          onTokenChange(token);
          setWidgetIssue("");
          setVerificationStatus("Verification complete. The request can now be submitted.");
        },
        "expired-callback": () => handleFailure("expired", "Verification expired. Please complete the check again before submitting."),
        "error-callback": () => handleFailure("widget_error", "Verification could not complete. Your entries remain in the form.")
      });
      setWidgetLoading(false);
    }).catch(() => {
      handleFailure(sdk ? "widget_error" : "script_error", sdk
        ? "Verification could not start. Your entries remain in the form."
        : "Verification could not load. Your entries remain in the form.");
    });

    return () => {
      active = false;
      const widgetId = widgetIdRef.current;
      widgetIdRef.current = null;
      try {
        if (widgetId) sdk?.remove(widgetId);
      } catch {
        // A stale provider widget must not prevent an in-place retry.
      } finally {
        container.replaceChildren();
      }
    };
  }, [compact, onFailure, onTokenChange, siteKey, widgetAttempt]);

  useEffect(() => {
    if (!resetKey) return;

    onTokenChange("");
    setVerificationStatus("");
    setWidgetIssue("");
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        onFailure?.("widget_error");
        setWidgetIssue("Verification could not restart. Your entries remain in the form.");
      }
    }
  }, [onFailure, onTokenChange, resetKey]);

  function retryButton(retry: () => void) {
    return (
      <button type="button" className="action-secondary mt-3 min-h-[44px] gap-2" onClick={() => {
        panelRef.current?.focus({ preventScroll: true });
        retry();
      }}>
        <RefreshCw aria-hidden="true" className="size-4 shrink-0" />
        Retry verification
      </button>
    );
  }

  if (!siteKey) {
    if (configState === "disabled") {
      return null;
    }

    const configFailed = configState === "error";

    return (
      <div
        ref={panelRef}
        role="group"
        aria-label="Verification"
        tabIndex={-1}
        className="border border-bioaxis-line bg-bioaxis-black p-4"
        data-turnstile-widget={configFailed ? "unavailable" : "loading"}
      >
        <p role="status" className="text-xs font-semibold  text-bioaxis-dim">
          {configFailed ? "Verification unavailable" : "Loading verification"}
        </p>
        {configFailed ? (
          <>
            <p role="alert" className="mt-2 text-xs font-semibold leading-5 text-bioaxis-accent">
              Verification could not load. Your entries remain in the form.
            </p>
            {retryButton(() => {
              setConfigState("loading");
              setConfigAttempt((attempt) => attempt + 1);
            })}
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={panelRef} role="group" aria-label="Verification" tabIndex={-1} className="border border-bioaxis-line bg-bioaxis-black p-3 sm:p-4" data-turnstile-widget="true">
      <div className="mb-2">
        <p className="text-xs font-semibold  text-bioaxis-dim">Verification</p>
        {!compact ? <p className="mt-2 text-xs leading-5 text-bioaxis-muted">This check protects the request form from spam. It should take only a moment.</p> : null}
      </div>
      <div ref={containerRef} className="cf-turnstile min-h-[58px]" />
      {widgetLoading ? <p role="status" className="text-xs text-bioaxis-dim">Loading verification</p> : null}
      {widgetIssue ? (
        <>
          <p role="alert" className="mt-3 text-xs font-semibold leading-5 text-bioaxis-accent">{widgetIssue}</p>
          {retryButton(() => {
            onTokenChange("");
            setVerificationStatus("");
            setWidgetIssue("");
            setWidgetLoading(true);
            setWidgetAttempt((attempt) => attempt + 1);
          })}
        </>
      ) : null}
      {verificationStatus ? (
        <p role="status" aria-live="polite" className="mt-3 text-xs font-semibold leading-5 text-emerald-700">
          {verificationStatus}
        </p>
      ) : null}
    </div>
  );
}
