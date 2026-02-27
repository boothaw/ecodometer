"use client";

import { useState } from "react";
import { deleteVehicle } from "../actions/vehicles";

type Vehicle = {
  id: number;
  name?: string | null;
  make?: string | null;
  model?: string | null;
};

type DeleteVehicleSectionProps = {
  vehicles: Vehicle[];
};

export function DeleteVehicleSection({ vehicles }: DeleteVehicleSectionProps) {
  const [step, setStep] = useState<"idle" | "selecting" | "confirming">("idle");
  const [selected, setSelected] = useState<Vehicle | null>(null);

  if (step === "confirming" && selected) {
    const label = selected.name ?? [selected.make, selected.model].filter(Boolean).join(" ") ?? "this vehicle";
    return (
      <div className="flex flex-col items-center gap-2 w-full">
        <p className="text-sm font-body text-center">
          Delete &ldquo;{label}&rdquo;? This will permanently remove all refuel history.
        </p>
        <div className="flex gap-2">
          <form action={deleteVehicle}>
            <input type="hidden" name="vehicleId" value={selected.id} />
            <button type="submit" className="btn btn-error btn-sm">Confirm Delete</button>
          </form>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setStep("idle"); setSelected(null); }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (step === "selecting") {
    return (
      <div className="flex flex-col items-center gap-2 w-full">
        <ul className="flex flex-col gap-2 w-full">
          {vehicles.map((v) => {
            const label = v.name ?? [v.make, v.model].filter(Boolean).join(" ") ?? "Unnamed";
            return (
              <li key={v.id} className="flex justify-between items-center gap-2">
                <span className="text-sm font-body">{label}</span>
                <button
                  type="button"
                  className="btn btn-error btn-sm"
                  onClick={() => { setSelected(v); setStep("confirming"); }}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setStep("idle")}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button type="button" className="btn btn-error" onClick={() => setStep("selecting")}>
      Delete Vehicle
    </button>
  );
}
