"use client";

import { useRef, useState } from "react";
import { Skeleton, SkeletonButton } from "./Skeleton";
import { editRefuel } from "../actions/refuels";
import { ocrMiles } from "../actions/ocr";
import { SubmitButton } from "./SubmitButton";

type RefuelCardProps = {
  refuel: {
    id: number;
    miles: number;
    gallons: number;
    date: Date;
    note?: string | null;
  };
  prevMiles: number | null;
  nextMiles: number | null;
  prevDate: Date | null;
  profileId: number;
  vehicleId: number;
};

export function RefuelCard({
  refuel,
  prevMiles,
  nextMiles,
  prevDate,
  profileId,
  vehicleId,
}: RefuelCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMiles, setEditMiles] = useState(String(refuel.miles));
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);

  function resizeImage(file: File, maxWidth = 800): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8).split(",")[1]);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async function handleCameraChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrLoading(true);
    setOcrError(null);
    const base64 = await resizeImage(file);
    const result = await ocrMiles(base64);
    if ("miles" in result) setEditMiles(String(result.miles));
    else setOcrError("Couldn't read odometer — enter manually");
    setOcrLoading(false);
  }

  const mpgValue =
    prevMiles != null ? (refuel.miles - prevMiles) / refuel.gallons : null;
  const mpg = mpgValue != null && mpgValue > 0 ? mpgValue.toFixed(1) : null;

  const milesDisplay = refuel.miles.toLocaleString();

  // Use timeZone: "UTC" so the display matches the stored calendar date
  // regardless of the user's local timezone.
  const dateDisplay = refuel.date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const pad = (n: number) => n.toString().padStart(2, "0");
  const d = refuel.date;
  // Use UTC getters so dates stored at UTC noon render the correct calendar day
  // in all browser timezones (local getters could shift ±1 day at the edges).
  const formattedDate = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

  const milesMin = prevMiles != null ? prevMiles + 1 : 1;
  const milesMax = nextMiles != null ? nextMiles - 1 : undefined;

  const minDateFormatted = prevDate
    ? `${prevDate.getUTCFullYear()}-${pad(prevDate.getUTCMonth() + 1)}-${pad(prevDate.getUTCDate())}`
    : undefined;

  return (
    <div className="card card-border w-full">
      {isEditing && (
        <div className="card-body text-left refuel-form-enter">
          <h3 className="text-lg font-semibold text-navy font-display card-title">
            Edit Fill Up
          </h3>
          <form
            action={async (formData) => {
              await editRefuel(formData);
              setIsEditing(false);
            }}
            className="flex flex-col gap-3 form"
          >
            <input type="hidden" name="refuelId" value={refuel.id} />
            <input type="hidden" name="vehicleId" value={vehicleId} />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleCameraChange}
            />
            <label className="form-control w-full">
              <span className="label-text">Total Miles</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="miles"
                  value={editMiles}
                  onChange={(e) => setEditMiles(e.target.value)}
                  min={milesMin}
                  max={milesMax}
                  required
                  className="input input-bordered flex-1"
                />
                <button
                  type="button"
                  className="btn btn-square btn-outline"
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={ocrLoading}
                >
                  {ocrLoading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  )}
                </button>
              </div>
              {ocrError && (
                <p className="text-error text-xs mt-1">{ocrError}</p>
              )}
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
                min={minDateFormatted}
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
                className="textarea textarea-bordered w-full font-body"
                rows={2}
              />
            </label>
            <div className="flex gap-2 mt-2">
              <SubmitButton pendingChildren="Saving...">Save</SubmitButton>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div className={isEditing ? "h-0 overflow-hidden" : ""}>
        <div className="card-body">
          <div className="card-title justify-between gap-6 items-center">
            <h3 className="text-2xl text-left">
              <span className="mpg-roller">
                <span key={mpg ?? "null"} className="mpg-animate">
                  {mpg ?? "--"}
                </span>
              </span>{" "}
              <span className="text-sm font-body font-bold">MPG</span>
            </h3>
            <p className="text-right font-extrabold text-sm">
              {milesDisplay} mi
            </p>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-left text-sm font-body font-bold">
                {dateDisplay}
              </p>
              {refuel.note && (
                <p className="text-left text-sm font-body mt-1">
                  {refuel.note}
                </p>
              )}
            </div>
            <div className="card-actions justify-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonRefuelCard() {
  return (
    <div className="card card-border w-full">
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
  );
}
