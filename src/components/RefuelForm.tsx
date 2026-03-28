"use client";

import { useRef, useState } from "react";
import { newRefuel } from "../actions/refuels";
import { ocrMiles } from "../actions/ocr";
import Tesseract from "tesseract.js";

type RefuelFormProps = {
  vehicle: {
    id: number;
    miles?: number | null;
    date?: Date | null;
    gallons?: number | null;
  };
  profileId: number;
  onClose?: () => void;
};

export default function RefuelForm({
  vehicle,
  profileId,
  onClose,
}: RefuelFormProps) {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  const [miles, setMiles] = useState("");
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
        canvas
          .getContext("2d")!
          .drawImage(img, 0, 0, canvas.width, canvas.height);
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
    const result = await ocrMiles(base64, "image/jpeg");
    if ("miles" in result)
      setMiles(String(result.miles)); // or setEditMiles
    else setOcrError("Couldn't read odometer — enter manually");
    setOcrLoading(false);
  }

  return (
    <div className="flex items-center justify-center font-body w-full mt-4">
      <div className="card-body card bg-white flex flex-col mx-auto gap-6 text-left w-full">
        <h3 className="text-lg font-semibold text-navy font-display card-title">
          Fill Er&apos; Up
        </h3>
        <form action={newRefuel} className="flex flex-col gap-3 form">
          <input type="hidden" name="vehicleId" value={vehicle.id} />
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
                placeholder={(vehicle.miles ?? undefined)?.toString()}
                min={vehicle.miles != null ? vehicle.miles + 1 : undefined}
                value={miles}
                onChange={(e) => setMiles(e.target.value)}
                required
                className="input input-bordered flex-1"
              />
              <button
                type="button"
                className="btn btn-square btn-outline"
                onClick={() => cameraInputRef.current?.click()}
              >
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
              </button>
            </div>
          </label>
          <label className="form-control w-full">
            <span className="label-text">Gallons Used</span>
            <input
              type="number"
              name="gallons"
              placeholder="e.g. 20.5"
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
              placeholder="Optional note..."
              maxLength={75}
              className="textarea textarea-bordered w-full font-body bg-white"
              rows={2}
            />
          </label>
          <div className="flex gap-2 mt-2">
            <button type="submit" className="btn btn-primary">
              Add Fill Up
            </button>
            {onClose && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
