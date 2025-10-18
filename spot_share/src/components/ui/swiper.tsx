import React, { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";

type SwipeToConfirmProps = {
  onConfirm: () => void;
  text?: string;
  disabled?: boolean;
};

const SwipeToConfirm = ({
  onConfirm,
  text = "Swipe to confirm",
  disabled = false,
}: SwipeToConfirmProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const buttonWidth = 60;
  const threshold = 0.85;

  useEffect(() => {
    if (disabled) {
      setPosition(0);
      setIsConfirmed(false);
    }
  }, [disabled]);

  const handleStart = (clientX: number) => {
    if (disabled || isConfirmed) return;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || disabled || isConfirmed) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const maxPosition = rect.width - buttonWidth;
    let newPosition = clientX - rect.left - buttonWidth / 2;

    newPosition = Math.max(0, Math.min(newPosition, maxPosition));
    setPosition(newPosition);

    if (newPosition / maxPosition >= threshold) {
      setIsConfirmed(true);
      setIsDragging(false);
      setTimeout(() => {
        onConfirm();
        setPosition(0);
        setIsConfirmed(false);
      }, 200);
    }
  };

  const handleEnd = () => {
    if (!isConfirmed) {
      setPosition(0);
    }
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleEnd);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleEnd);
      };
    }
  }, [isDragging]);

  const progressPercentage = containerRef.current
    ? (position / (containerRef.current.offsetWidth - buttonWidth)) * 100
    : 0;

  return (
    <div
      ref={containerRef}
      className={`relative h-16 rounded-full overflow-hidden select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      style={{
        background: `linear-gradient(to right, hsl(var(--primary)) ${progressPercentage}%, hsl(var(--muted)) ${progressPercentage}%)`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className={`text-sm font-medium transition-opacity ${
            position > 50 ? "opacity-0" : "opacity-100"
          } ${
            progressPercentage > 0
              ? "text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          {text}
        </span>
      </div>

      <button
        ref={buttonRef}
        className={`absolute top-1 bottom-1 left-1 w-[56px] bg-card rounded-full shadow-lg flex items-center justify-center transition-transform ${
          disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"
        } ${isConfirmed ? "scale-95" : "scale-100"}`}
        style={{
          transform: `translateX(${position}px)`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        disabled={disabled}
      >
        <ChevronRight
          className={`h-6 w-6 transition-colors ${
            progressPercentage > 50 ? "text-primary" : "text-muted-foreground"
          }`}
        />
      </button>
    </div>
  );
};

export default SwipeToConfirm;
