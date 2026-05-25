import { useEffect, useRef } from "react";

// Small white dot that follows the cursor. mix-blend-mode: difference inverts
// it automatically so it appears black on light backgrounds and white on
// dark ones. When `enlargeOnHover` is true, the dot grows on clickable
// targets (button, a, [role=button]).
export default function CustomCursor({ enlargeOnHover = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };
    window.addEventListener("mousemove", onMove);

    let onOver;
    if (enlargeOnHover) {
      onOver = (e) => {
        if (!ref.current) return;
        const interactive = e.target?.closest?.('button, a, [role="button"]');
        const size = interactive ? 24 : 12;
        ref.current.style.width = `${size}px`;
        ref.current.style.height = `${size}px`;
      };
      document.addEventListener("mouseover", onOver);
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (onOver) document.removeEventListener("mouseover", onOver);
    };
  }, [enlargeOnHover]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "#fff",
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-100px, -100px)",
        transition: enlargeOnHover ? "width 0.18s ease-out, height 0.18s ease-out" : "none",
      }}
    />
  );
}
