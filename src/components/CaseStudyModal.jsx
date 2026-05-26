import { useEffect, useState } from "react";
import CaseStudyCard from "./CaseStudyCard";

// Shared modal shell that wraps a CaseStudyCard. Used by:
//   - App.jsx's /work/:slug modal route (deep-linkable case studies)
//   - any future caller that needs the same overlay treatment
//
// The shell handles the backdrop + card animation in/out and the
// 260ms close-delay so the user sees the card shrink back down before
// the route actually changes. Escape key + backdrop click both close.
export default function CaseStudyModal({ study, onClose }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => onClose(), 260);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          ? "cs-backdrop-out 0.26s ease-in forwards"
          : "cs-backdrop-in 0.3s ease-out both",
      }}
    >
      <div
        className="cs-modal-card"
        style={{
          position: "relative",
          width: "min(740px, 100%)",
          height: "min(580px, calc(100vh - 80px))",
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(18px) saturate(1.1)",
          WebkitBackdropFilter: "blur(18px) saturate(1.1)",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 24px 60px rgba(0,0,0,0.22), 0 6px 18px rgba(0,0,0,0.10)",
          animation: closing
            ? "cs-modal-out 0.26s ease-in forwards"
            : "cs-modal-in 0.3s ease-out both",
        }}
      >
        <CaseStudyCard study={study} onClose={handleClose} />
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
