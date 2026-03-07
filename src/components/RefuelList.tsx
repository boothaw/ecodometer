"use client";

import { useState } from "react";
import { RefuelCard } from "./RefuelCard";
import { loadMoreRefuels } from "@/src/actions/refuels";

const BATCH = 10;

type SerializedRefuel = {
  id: number;
  vehicleId: number;
  miles: number;
  gallons: number;
  date: string;
  note: string | null;
  createdAt: string;
};

type ContextInfo = {
  miles: number;
  date: string | null;
};

type Props = {
  // Server sends up to 11 items: first 10 to render + 1 as prevMiles context.
  // The key prop on this component (set in the parent page) forces a full
  // remount whenever the server-rendered data changes, discarding stale state.
  initialRefuels: SerializedRefuel[];
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
  const initialShown = Math.min(BATCH, totalCount);

  // allItems holds only rendered items — the context entry (+1) is stored separately.
  const [allItems, setAllItems] = useState<SerializedRefuel[]>(
    initialRefuels.slice(0, initialShown)
  );

  // oldestContext gives prevMiles/prevDate for the oldest rendered item.
  const [oldestContext, setOldestContext] = useState<ContextInfo | null>(
    initialRefuels[initialShown]
      ? { miles: initialRefuels[initialShown].miles, date: initialRefuels[initialShown].date }
      : null
  );

  const [loading, setLoading] = useState(false);
  // Tracks which refuel card should animate its MPG after a save.
  // Set optimistically on submit; cleared when RefuelList remounts (list key changes after RSC refresh).
  const [justEditedId, setJustEditedId] = useState<number | null>(null);

  const shownCount = allItems.length;
  const hasMore = shownCount < totalCount;

  async function handleLoadMore() {
    setLoading(true);
    try {
      const more = await loadMoreRefuels(vehicleId, shownCount);
      // more has up to BATCH+1 items: BATCH to render, 1 for the new context entry.
      const newItems = more.slice(0, BATCH);
      const newContext = more[BATCH]
        ? { miles: more[BATCH].miles, date: more[BATCH].date }
        : null;

      setAllItems((prev) => [...prev, ...newItems]);
      setOldestContext(newContext);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <ul className="flex flex-col gap-4 w-full">
        {allItems.map((refuel, i) => {
          const isOldest = i === allItems.length - 1;

          const prevMiles = isOldest
            ? (oldestContext?.miles ?? initialMiles)
            : allItems[i + 1].miles;

          const nextMiles = i === 0 ? null : allItems[i - 1].miles;

          const prevDate = isOldest
            ? (oldestContext?.date ? new Date(oldestContext.date) : null)
            : new Date(allItems[i + 1].date);

          return (
            <li key={refuel.id}>
              <RefuelCard
                refuel={{ ...refuel, date: new Date(refuel.date) }}
                prevMiles={prevMiles}
                nextMiles={nextMiles}
                prevDate={prevDate}
                profileId={profileId}
                vehicleId={vehicleId}
                animate={refuel.id === justEditedId}
                onSaved={() => setJustEditedId(refuel.id)}
              />
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <button
          type="button"
          className="btn btn-primary mx-auto"
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
