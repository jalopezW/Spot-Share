"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/**
 * Reusable Modal component
 * - Nearly full-screen, leaving a small rim of the page visible
 * - Children-based content
 * - ESC / overlay / button to close
 * - Scroll lock + focus return
 * - Smooth open animation
 */

// items/ModalsAbout.tsx
type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
};

function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const [animate, setAnimate] = useState(false);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus, scroll lock, and trigger animation
  useEffect(() => {
    if (open) {
      lastFocused.current = (document.activeElement as HTMLElement) ?? null;
      const el = dialogRef.current;
      const toFocus = el?.querySelector<HTMLElement>(
        "[data-autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      toFocus?.focus();
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // kick off enter animation on next frame
      requestAnimationFrame(() => setAnimate(true));
      return () => {
        document.body.style.overflow = prev;
        setAnimate(false);
        lastFocused.current?.focus?.();
      };
    }
  }, [open]);

  const onBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm",
        // backdrop fade-in
        "transition-opacity duration-200",
        animate ? "bg-black/60 opacity-100" : "bg-black/0 opacity-0",
      ].join(" ")}
      onMouseDown={onBackdropClick}
      aria-hidden={!open}
    >
      {/* Panel: leaves a visible margin so it doesn't fully cover the screen */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={[
          "relative rounded-2xl shadow-2xl outline-none",
          "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100",
          // Sizing: most of the screen, small rim visible
          "m-3 w-[94vw] h-[92vh] md:w-[92vw] md:h-[88vh] max-w-[1400px]",
          // Enter animation
          "transform transition-all duration-200 ease-out",
          animate
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-1",
        ].join(" ")}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 p-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
          <h2 id="modal-title" className="text-lg font-semibold tracking-tight">
            {title ?? "Modal"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center gap-2 rounded-full p-2 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="h-[calc(100%-3.5rem)] overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
