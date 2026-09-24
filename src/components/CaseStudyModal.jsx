import { useEffect, useState } from "react";
import CaseStudyCard from "./CaseStudyCard";
import { lockPageScroll, unlockPageScroll } from "../hooks/modalScrollLock";

// Shared modal shell that wraps a CaseStudyCard. Used by:
//   - App.jsx's /work/:slug modal route (deep-linkable case studies)
//   - any future caller that needs the same overlay treatment
//
// The shell handles the backdrop + card animation in/out and the
// 160ms close-delay so the user sees the card shrink back down before
// the route actually changes. Escape key + backdrop click both close.
export default function CaseStudyModal({ study, onClose, onNext, nextLabel }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => onClose(), 160);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock the background page's scroll while the modal is open. Two
  // parts, because two different things can move the background:
  //   1. Native user scroll (wheel/trackpad/touch/scrollbar) — blocked
  //      by overflow:hidden on <body>/<html>.
  //   2. Landing's Lenis instance, which scrolls document.documentElement
  //      directly via JS in its own rAF loop — overflow:hidden does NOT
  //      stop a programmatic scroll, only user-driven ones. Landing
  //      subscribes to this lock signal and calls lenis.stop()/.start().
  useEffect(() => {
    const { body, documentElement: html } = document;
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      const currentPaddingRight = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }
    lockPageScroll();
    return () => {
      body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
      body.style.paddingRight = prevPaddingRight;
      unlockPageScroll();
    };
  }, []);

  // Belt-and-suspenders: intercept wheel/touch input at the window level,
  // in the capture phase, before it reaches Lenis, native scroll, OR any
  // other scroll mechanism the background page might use. overflow:hidden
  // + lenis.stop() cover the known cases, but this is the one guarantee
  // that holds regardless of what's driving the background's scroll —
  // anything outside the modal's own scrollable body (.cs-card-scroll)
  // is blocked outright.
  useEffect(() => {
    const isInsideScrollable = (target) =>
      target instanceof Element && !!target.closest(".cs-card-scroll");
    const block = (e) => {
      if (!isInsideScrollable(e.target)) e.preventDefault();
    };
    window.addEventListener("wheel", block, { passive: false, capture: true });
    window.addEventListener("touchmove", block, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", block, { capture: true });
      window.removeEventListener("touchmove", block, { capture: true });
    };
  }, []);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "rgba(0, 0, 0, 0.20)",
        zIndex: 50,
        pointerEvents: "auto",
        animation: closing
          ? "cs-backdrop-out 0.16s ease-in forwards"
          : "cs-backdrop-in 0.18s ease-out both",
      }}
    >
      <div
        className="cs-modal-card"
        style={{
          position: "relative",
          width: "min(740px, 100%)",
          height: "min(580px, calc(100vh - 80px))",
          background: "rgba(255, 255, 255, 0.96)",
          // Lighter blur than before (18px → 8px): backdrop-filter is
          // GPU-heavy and was resampled every frame against a
          // continuously animating background (homepage carousel drift,
          // /work scatter thumbs), which is what made the pop-up feel
          // laggy to open/close.
          backdropFilter: "blur(8px) saturate(1.1)",
          WebkitBackdropFilter: "blur(8px) saturate(1.1)",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 24px 60px rgba(0,0,0,0.22), 0 6px 18px rgba(0,0,0,0.10)",
          animation: closing
            ? "cs-modal-out 0.16s ease-in forwards"
            : "cs-modal-in 0.18s ease-out both",
        }}
      >
        <CaseStudyCard study={study} onClose={handleClose} onNext={onNext} nextLabel={nextLabel} />
      </div>

      <style>{`
        @keyframes cs-modal-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes cs-modal-out {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.95); }
        }
        @keyframes cs-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cs-backdrop-out { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
    </div>
  );
}
