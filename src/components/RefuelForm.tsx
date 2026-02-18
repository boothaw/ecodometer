import { newRefuel } from "../actions/refuels";
import Link from "next/link";

export default function RefuelForm({
  vehicleId,
  profileId,
}: {
  vehicleId: number;
  profileId: number;
}) {
  return (
    <div className="card-body card bg-white flex flex-col mx-auto gap-6 text-center sm:text-left w-full">
      <h3 className="text-lg font-semibold text-navy font-display card-title">
        Fill Er&apos; Up
      </h3>
      <form action={newRefuel} className="flex flex-col gap-3 form">
        <input type="hidden" name="vehicleId" value={vehicleId} />
        <label className="form-control w-full">
          <span className="label-text">Date</span>
          <input
            className="input input-bordered w-full"
            type="datetime-local"
            id="event-date"
            name="event-date"
            required
          />
        </label>
        <label className="form-control w-full">
          <span className="label-text">Gallons Used</span>
          <input
            type="number"
            name="gallons"
            placeholder="e.g. 20.5"
            min={0}
            max={50}
            required
            className="input input-bordered w-full"
          />
        </label>
        <label className="form-control w-full">
          <span className="label-text">Total Miles</span>
          <input
            type="number"
            name="miles"
            placeholder="e.g. 55000"
            min={0}
            max={500000}
            required
            className="input input-bordered w-full"
          />
        </label>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="btn btn-primary">
            Add Fill Up
          </button>
          <Link href={`/profile/${profileId}`} className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
