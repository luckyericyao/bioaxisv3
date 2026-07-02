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
};

type TurnstileConfigResponse = {
  enabled?: boolean;
  siteKey?: string;
};

const buildTimeSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export function TurnstileWidget({ onTokenChange, onAvailabilityChange }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [siteKey, setSiteKey] = useState(buildTimeSiteKey);
  const [configLoaded, setConfigLoaded] = useState(Boolean(buildTimeSiteKey));
  const [scriptReady, setScriptReady] = useState(false);

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
      size: "normal",
      callback: (token) => onTokenChange(token),
      "expired-callback": () => onTokenChange(""),
      "error-callback": () => onTokenChange("")
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onTokenChange, scriptReady, siteKey]);

  if (!siteKey) {
    return configLoaded ? null : (
      <div className="border border-bioaxis-line bg-bioaxis-black p-4" data-turnstile-widget="loading">
        <p className="text-xs font-bold uppercase text-bioaxis-dim">Loading verification</p>
      </div>
    );
  }

  return (
    <div className="border border-bioaxis-line bg-bioaxis-black p-4" data-turnstile-widget="true">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <p className="mb-3 text-xs font-bold uppercase text-bioaxis-dim">Verification</p>
      <div ref={containerRef} className="cf-turnstile min-h-[65px]" />
    </div>
  );
}
