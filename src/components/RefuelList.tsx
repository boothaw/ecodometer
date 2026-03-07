"use client";

import { useState } from "react";
import { RefuelCard } from "./RefuelCard";
import { loadMoreRefuels } from "@/src/actions/refuels";

type SerializedRefuel = {
  id: number;
  vehicleId: number;
  miles: number;
  gallons: number;
  date: string;
  note: string | null;
  createdAt: string;
};

type Props = {
  initialRefuels: SerializedRefuel[]; // first 11 (10 to show + 1 for prevMiles)
  totalCount: number;
  vehicleId: number;
  profileId: number;
  initialMiles: number;
};

export default function RefuelList({
  initialRefuels,
  totalCount,
  vehicleId,
  profileId,
  initialMiles,
}: Props) {
  const [refuels, setRefuels] = useState(initialRefuels);
  const [loading, setLoading] = useState(false);

  // How many are actually rendered (not the context +1)
  const shownCount = Math.min(refuels.length, totalCount);
  const hasMore = shownCount < totalCount;

  async function handleLoadMore() {
    setLoading(true);
    try {
      // skip = number of refuels already shown (not counting the context +1)
      const shown = Math.min(refuels.length, totalCount);
      const more = await loadMoreRefuels(vehicleId, shown);
      // Keep all "real" items plus append new batch
      setRefuels((prev) => {
        const realPrev = prev.slice(0, shown);
        return [...realPrev, ...more];
      });
    } finally {
      setLoading(false);
    }
  }

  const renderedRefuels = refuels.slice(0, Math.min(totalCount, refuels.length));
  // The context entry (for prevMiles of oldest rendered) is refuels[renderedRefuels.length]

  return (
    <div className="flex flex-col gap-4 w-full">
      <ul className="flex flex-col gap-4 w-full">
        {renderedRefuels.map((refuel, i) => {
          const isOldest = i === renderedRefuels.length - 1;
          // The entry just beyond the rendered list (context entry) gives prevMiles for oldest
          const contextEntry = refuels[renderedRefuels.length];
          const prevMiles = isOldest
            ? (contextEntry?.miles ?? initialMiles)
            : refuels[i + 1]?.miles ?? null;
          const nextMiles = i === 0 ? null : refuels[i - 1]?.miles ?? null;
          const prevDate = refuels[i + 1]?.date ? new Date(refuels[i + 1].date) : null;

          return (
            <li key={refuel.id}>
              <RefuelCard
                refuel={{ ...refuel, date: new Date(refuel.date) }}
                prevMiles={prevMiles}
                nextMiles={nextMiles}
                prevDate={prevDate}
                profileId={profileId}
                vehicleId={vehicleId}
              />
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <button
          type="button"
          className="btn btn-primary w-full"
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
