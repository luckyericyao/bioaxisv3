"use client";

import { useEffect } from "react";
import { consumeSourcingListHandoffFocus } from "@/lib/sourcingListStorage";

export function SourcingListHandoffFocus({ handoffId, titleId }: { handoffId: string; titleId: string }) {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!consumeSourcingListHandoffFocus(handoffId)) return;
      const active = document.activeElement;
      if (active !== document.body && active?.id !== "main-content") return;
      const title = document.getElementById(titleId);
      if (!title) return;
      title.focus({ preventScroll: true });
      const { top, bottom } = title.getBoundingClientRect();
      const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      if (top < headerBottom || bottom > window.innerHeight) title.scrollIntoView({ block: "start", behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [handoffId, titleId]);
  return null;
}
