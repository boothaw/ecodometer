"use client";

import { useState } from "react";
import RefuelForm from "./RefuelForm";

type RefuelSectionProps = {
  vehicle: {
    id: number;
    miles?: number | null;
    date?: Date | null;
    gallons?: number | null;
  };
  profileId: number;
  mpgMode: "total" | "recent";
  onToggleMpg: () => void;
  hasRecentMpg: boolean;
};

export default function RefuelSection({
  vehicle,
  profileId,
  mpgMode,
  onToggleMpg,
  hasRecentMpg,
}: RefuelSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-between w-full items-center gap-2">
        <button
          type="button"
          className="btn btn-secondary text-xs"
          onClick={onToggleMpg}
          disabled={!hasRecentMpg}
          title={
            mpgMode === "total"
              ? "Showing total MPG — click for recent"
              : "Showing recent MPG — click for total"
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><path d="M 25 2 C 12.264481 2 2 12.264481 2 25 C 2 37.735519 12.264481 48 25 48 C 37.735519 48 48 37.735519 48 25 C 48 12.264481 37.735519 2 25 2 z M 25 4 C 36.664481 4 46 13.335519 46 25 C 46 36.664481 36.664481 46 25 46 C 13.335519 46 4 36.664481 4 25 C 4 13.335519 13.335519 4 25 4 z M 25 11 A 3 3 0 0 0 25 17 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 23 23 L 23 36 L 21 36 L 21 38 L 29 38 L 29 36 L 27 36 L 27 21 L 21 21 z"/></svg>
        </button>
        <h3 className="text-lg font-body font-bold flex-1 text-left">{mpgMode === "total" ? "Total MPG" : "Recent MPG"}</h3>
        <h3 className="text-lg font-body font-bold flex-1 text-right">Fill Up</h3>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="#7587a0"
          >
            <path d="m19.616 6.48.014-.017-4-3.24-1.26 1.554 2.067 1.674a2.99 2.99 0 0 0-1.394 3.062c.15.899.769 1.676 1.57 2.111.895.487 1.68.442 2.378.194L18.976 18a.996.996 0 0 1-1.39.922.995.995 0 0 1-.318-.217.996.996 0 0 1-.291-.705L17 16a2.98 2.98 0 0 0-.877-2.119A3 3 0 0 0 14 13h-1V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-4h1c.136 0 .267.027.391.078a1.028 1.028 0 0 1 .531.533A.994.994 0 0 1 15 16l-.024 2c0 .406.079.799.236 1.168.151.359.368.68.641.951a2.97 2.97 0 0 0 2.123.881c.406 0 .798-.078 1.168-.236.358-.15.68-.367.951-.641A2.983 2.983 0 0 0 20.976 18L21 9a2.997 2.997 0 0 0-1.384-2.52z" />
          </svg>
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className={open ? "refuel-form-enter" : ""}>
            <RefuelForm
              vehicle={vehicle}
              profileId={profileId}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
