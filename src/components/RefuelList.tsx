"use client";

import { useEffect, useState } from "react";
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

  const [allItems, setAllItems] = useState<SerializedRefuel[]>(
    initialRefuels.slice(0, initialShown)
  );

  const [oldestContext, setOldestContext] = useState<ContextInfo | null>(
    initialRefuels[initialShown]
      ? { miles: initialRefuels[initialShown].miles, date: initialRefuels[initialShown].date }
      : null
  );

  const [loading, setLoading] = useState(false);

  // When the server delivers fresh initialRefuels (after an edit via revalidatePath),
  // patch only the items that changed. This keeps load-more items intact while
  // allowing individual card MPG spans (key={mpg}) to detect the value change and
  // replay their animation — the same mechanism VehicleStats uses for the total MPG.
  const refuelKey = initialRefuels.map((r) => `${r.id}:${r.miles}:${r.gallons}`).join("|");
  useEffect(() => {
    setAllItems((prev) =>
      prev.map((item) => {
        const fresh = initialRefuels.find((r) => r.id === item.id);
        return fresh ?? item;
      })
    );
    // Re-derive the context entry (11th item) from fresh server data.
    const freshContext = initialRefuels[initialShown];
    setOldestContext(
      freshContext ? { miles: freshContext.miles, date: freshContext.date } : null
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refuelKey]);

  const shownCount = allItems.length;
  const hasMore = shownCount < totalCount;

  async function handleLoadMore() {
    setLoading(true);
    try {
      const more = await loadMoreRefuels(vehicleId, shownCount);
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
