"use client";

import { useState } from "react";
import RefuelSection from "./RefuelSection";

type VehicleForStats = {
  id: number;
  miles?: number | null;
  date?: Date | null;
  gallons?: number | null;
};

type Props = {
  vehicleName: string | null;
  makeModel: string;
  overallMpg: string | null;
  recentMpg: string | null;
  vehicle: VehicleForStats;
  profileId: number;
};

export default function VehicleStats({
  vehicleName,
  makeModel,
  overallMpg,
  recentMpg,
  vehicle,
  profileId,
}: Props) {
  const [mpgMode, setMpgMode] = useState<"total" | "recent">("total");
  const activeMpg = mpgMode === "total" ? overallMpg : recentMpg;

  function toggleMpgMode() {
    setMpgMode((m) => (m === "total" ? "recent" : "total"));
  }

  return (
    <>
      <div className="card card-body flex justify-between w-full items-center flex-col gap-2 overflow-hidden">
        <h1 className="max-w-xs text-3xl font-semibold text-navy font-display text-center leading-none flex flex-col justify-center items-center">
          <span className="animate-fade-in-right inline-block">{vehicleName ?? "Vehicle"}</span>
          <div className="flex items-center gap-1 mx-auto">
            <span className="text-yellow text-base">=</span>{" "}
            <span className="text-base inline-block">{makeModel}</span>{" "}
            <span className="text-yellow text-base">=</span>
          </div>
        </h1>
        <div className="flex justify-center w-full items-center">
          <h2 className="text-2xl text-center">
            <span key={activeMpg ?? "null"} className="mpg-animate">
              {activeMpg ?? "—"}
            </span>{" "}
            <span className="text-sm font-body font-bold">MPG</span>
          </h2>
        </div>
      </div>

      <RefuelSection
        vehicle={vehicle}
        profileId={profileId}
        mpgMode={mpgMode}
        onToggleMpg={toggleMpgMode}
        hasRecentMpg={recentMpg !== null}
      />
    </>
  );
}
