"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";

interface Reasons {
  [key: number]: string[];
}

export default function RateSeller(): React.ReactElement {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const reasons: Reasons = {
    1: [
      "Didn't leave the spot",
      "Wrong location",
      "No-show",
      "Unsafe behavior",
      "Rude",
    ],
    2: [
      ">15 min late",
      "Pin inaccurate",
      "Poor communication",
      "Changed terms",
      "Messy/blocked spot",
    ],
    3: [
      "Okay but confusing",
      "5–15 min wait",
      "Price felt high",
      "Hard to find",
      "Slow replies",
    ],
    4: [
      "<5 min late",
      "Clear instructions",
      "Accurate pin",
      "Good value",
      "Would use again",
    ],
    5: [
      "On-time handoff",
      "Exactly as listed",
      "Fair price",
      "Great communication",
      "Safe + easy",
    ],
  };

  const handleStarClick = (rating: number): void => {
    setSelectedRating(rating);
    setSelectedReasons([]);
  };

  const toggleReason = (reason: string): void => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = (): void => {
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="pt-[10vh] pb-4 text-center">
        <h1 className="text-3xl font-bold text-black mb-2">Rate Seller</h1>
        <p className="text-slate-600 text-base">
          Tap a star, then choose a reason.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 w-full max-w-2xl mx-auto">
        {/* Stars */}
        <div className="flex justify-center gap-3 mt-6 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleStarClick(star)}
              className="transition-transform active:scale-95 hover:scale-110"
            >
              {star <= selectedRating ? (
                <Star className="h-12 w-12 fill-orange-500 text-orange-500" />
              ) : (
                <Star className="h-12 w-12 text-slate-300" />
              )}
            </button>
          ))}
        </div>

        {/* Reason Pills */}
        {selectedRating > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm w-full">
            <div className="flex flex-wrap gap-2 justify-center">
              {reasons[selectedRating].map((reason) => (
                <button
                  key={reason}
                  onClick={() => toggleReason(reason)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedReasons.includes(reason)
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/60 bg-white mt-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          <button
            onClick={handleSubmit}
            disabled={selectedRating === 0 || selectedReasons.length === 0}
            className={`w-full rounded-xl py-4 text-white font-semibold text-base shadow-md transition-all ${
              selectedRating > 0 && selectedReasons.length > 0
                ? "bg-red-500 hover:brightness-95 cursor-pointer"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            Submit
          </button>

          <p className="mt-4 text-center text-slate-500 text-xs">
            Your feedback helps other students.
          </p>

          <button className="mt-3 w-full text-center text-blue-600 text-sm font-medium hover:underline">
            Report issue
          </button>
        </div>
      </footer>
    </div>
  );
}
