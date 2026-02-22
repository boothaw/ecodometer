"use client";

import { useState } from "react";
import { Skeleton, SkeletonButton } from "./Skeleton";
import { editRefuel } from "../actions/refuels";

type RefuelCardProps = {
  refuel: {
    id: number
    miles: number
    gallons: number
    date: Date
    note?: string | null
  }
  prevMiles: number | null
  nextMiles: number | null
  profileId: number
  vehicleId: number
}

export function RefuelCard({ refuel, prevMiles, nextMiles, profileId, vehicleId }: RefuelCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const mpgValue =
    prevMiles != null
      ? (refuel.miles - prevMiles) / refuel.gallons
      : null;
  const mpg = mpgValue != null && mpgValue > 0 ? mpgValue.toFixed(1) : null;

  const milesDisplay = refuel.miles.toLocaleString();

  const dateDisplay = refuel.date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const pad = (n: number) => n.toString().padStart(2, "0");
  const d = refuel.date;
  const formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const milesMin = prevMiles != null ? prevMiles + 1 : 1;
  const milesMax = nextMiles != null ? nextMiles - 1 : undefined;

  if (isEditing) {
    return (
      <div className="card card-border w-full bg-white refuel-form-enter">
        <div className="card-body text-left">
          <h3 className="text-lg font-semibold text-navy font-display card-title">Edit Fill Up</h3>
          <form action={editRefuel} className="flex flex-col gap-3 form" onSubmit={() => setIsEditing(false)}>
            <input type="hidden" name="refuelId" value={refuel.id} />
            <input type="hidden" name="vehicleId" value={vehicleId} />
            <label className="form-control w-full">
              <span className="label-text">Total Miles</span>
              <input
                type="number"
                name="miles"
                defaultValue={refuel.miles}
                min={milesMin}
                max={milesMax}
                required
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text">Gallons Used</span>
              <input
                type="number"
                name="gallons"
                defaultValue={refuel.gallons}
                step="0.01"
                min={0}
                max={50}
                required
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text">Date</span>
              <input
                className="input input-bordered w-full"
                type="date"
                id="event-date"
                name="event-date"
                defaultValue={formattedDate}
                required
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text">Note</span>
              <textarea
                name="note"
                defaultValue={refuel.note ?? ""}
                placeholder="Optional note..."
                maxLength={75}
                className="textarea textarea-bordered w-full font-body bg-white"
                rows={2}
              />
            </label>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-border w-full bg-white">
        <div className="card-body">
            <div className="card-title justify-between gap-6 items-center">
                <h3 className="text-2xl text-left">{mpg ?? "--"} <span className="text-sm font-body font-bold">MPG</span></h3>
                <p className="text-right font-extrabold text-sm">{milesDisplay} mi</p>
            </div>
            <div className="flex justify-between gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-left text-sm font-body font-bold">{dateDisplay}</p>
               {refuel.note && (
                <p className="text-left text-sm font-body mt-1">{refuel.note}</p>
              )}
            </div>
            <div className="card-actions justify-end">
              <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            </div>
        </div>
    </div>
  )
}

export function SkeletonRefuelCard() {
  return (
    <div className="card card-border w-full bg-white">
      <div className="card-body">
        <div className="card-title justify-between gap-6 items-center">
          <Skeleton short />
          <Skeleton short />
        </div>
        <div className="flex justify-between gap-2">
          <Skeleton short />
          <SkeletonButton />
        </div>
      </div>
    </div>
  )
}
