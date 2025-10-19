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

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

function Modal({ open, onClose, title, children, className }: ModalProps) {
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
        // overlay
        "fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm",
        "p-4 sm:p-8", // <-- add safe padding around the viewport
        "transition-opacity duration-200",
        animate ? "bg-black/40 opacity-100" : "bg-black/0 opacity-0",
      ].join(" ")}
      onMouseDown={onBackdropClick}
      aria-hidden={!open}
    >
      {/* Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={[
          "relative rounded-2xl shadow-2xl outline-none",
          "bg-white text-zinc-900 dark:bg-gray-200 dark:text-zinc-900",

          // ---- CHANGES START ----
          // Instead of fixed height (which can clip at the top),
          // use a top margin + max-height. This pushes the modal down
          // and ensures internal scrolling if it's tall.
          "w-[94vw] md:w-[809vw] max-w-[1000px]",
          "mt-16 md:mt-20", // push panel down from navbar
          "max-h-[85vh] overflow-hidden", // never exceed viewport height
          // ---- CHANGES END ----

          className,

          // Enter animation
          "transform transition-all duration-200 ease-out",
          animate
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-1",
        ].join(" ")}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 p-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-200/80">
          <h2 id="modal-title" className="text-lg font-semibold tracking-tight">
            {title ?? "Modal"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center gap-2 rounded-full p-2 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-zinc-300 hover:cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body (scrollable inside the panel) */}
        <div className="p-6 overflow-auto max-h-[calc(85vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
