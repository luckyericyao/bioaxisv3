"use client";

import Script from "next/script";
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
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type TurnstileWidgetProps = {
  onTokenChange: (token: string) => void;
  onAvailabilityChange?: (available: boolean) => void;
  onFailure?: (reason: string) => void;
  compact?: boolean;
};

type TurnstileConfigResponse = {
  enabled?: boolean;
  siteKey?: string;
};

const buildTimeSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const fallbackEmail = "crazyowenyao@gmail.com";

export function TurnstileWidget({ onTokenChange, onAvailabilityChange, onFailure, compact = false }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [siteKey, setSiteKey] = useState(buildTimeSiteKey);
  const [configLoaded, setConfigLoaded] = useState(Boolean(buildTimeSiteKey));
  const [scriptReady, setScriptReady] = useState(false);
  const [widgetIssue, setWidgetIssue] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");

  useEffect(() => {
    if (buildTimeSiteKey) {
      onAvailabilityChange?.(true);
      return;
    }

    let ignore = false;

    async function loadRuntimeConfig() {
      try {
        const response = await fetch("/api/turnstile/config", { cache: "no-store" });
        const config = (await response.json()) as TurnstileConfigResponse;

        if (!ignore) {
          setSiteKey(config.enabled && config.siteKey ? config.siteKey : "");
          onAvailabilityChange?.(Boolean(config.enabled && config.siteKey));
        }
      } catch {
        if (!ignore) {
          setSiteKey("");
          onAvailabilityChange?.(false);
        }
      } finally {
        if (!ignore) {
          setConfigLoaded(true);
        }
      }
    }

    loadRuntimeConfig();

    return () => {
      ignore = true;
    };
  }, [onAvailabilityChange]);

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile || widgetIdRef.current) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "light",
      size: compact ? "compact" : "normal",
      callback: (token) => {
        onTokenChange(token);
        setWidgetIssue("");
        setVerificationStatus("Verification complete. The request can now be submitted.");
      },
      "expired-callback": () => {
        onTokenChange("");
        setVerificationStatus("");
        onFailure?.("expired");
        setWidgetIssue("Verification expired. Please complete the check again before submitting.");
      },
      "error-callback": () => {
        onTokenChange("");
        setVerificationStatus("");
        onFailure?.("widget_error");
        setWidgetIssue(`Verification could not complete. Try again, or email ${fallbackEmail} directly.`);
      }
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [compact, onFailure, onTokenChange, scriptReady, siteKey]);

  if (!siteKey) {
    return configLoaded ? null : (
      <div className="border border-bioaxis-line bg-bioaxis-black p-4" data-turnstile-widget="loading">
        <p className="text-xs font-bold uppercase text-bioaxis-dim">Loading verification</p>
      </div>
    );
  }

  return (
    <div className="border border-bioaxis-line bg-bioaxis-black p-3 sm:p-4" data-turnstile-widget="true">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          setWidgetIssue("");
          setScriptReady(true);
        }}
        onError={() => {
          onFailure?.("script_error");
          setWidgetIssue(`Verification could not load. Email ${fallbackEmail} directly if the form is blocked.`);
        }}
      />
      <div className="mb-2">
        <p className="text-xs font-bold uppercase text-bioaxis-dim">Verification</p>
        {!compact ? <p className="mt-2 text-xs leading-5 text-bioaxis-muted">This check protects the request form from spam. It should take only a moment.</p> : null}
      </div>
      <div ref={containerRef} className="cf-turnstile min-h-[58px]" />
      {widgetIssue ? (
        <p role="alert" className="mt-3 text-xs font-semibold leading-5 text-bioaxis-accent">
          {widgetIssue}
        </p>
      ) : null}
      {verificationStatus ? (
        <p role="status" aria-live="polite" className="mt-3 text-xs font-semibold leading-5 text-emerald-700">
          {verificationStatus}
        </p>
      ) : null}
    </div>
  );
}
