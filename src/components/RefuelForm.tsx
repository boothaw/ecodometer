import { newRefuel } from "../actions/refuels";

type RefuelFormProps = {
  vehicle: {
    id: number
    miles?: number | null
    date?: Date | null
    gallons?: number | null
  }
  profileId: number
  onClose?: () => void
}

export default function RefuelForm({ vehicle, profileId, onClose }: RefuelFormProps) {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const vehicleMiles = vehicle.miles ?? undefined;



  return (
    <div className="flex items-center justify-center font-body w-full mt-4">
      <div className="card-body card bg-white flex flex-col mx-auto gap-6 text-center sm:text-left w-full">
        <h3 className="text-lg font-semibold text-navy font-display card-title">
          Fill Er&apos; Up
        </h3>
        <form action={newRefuel} className="flex flex-col gap-3 form">
          <input type="hidden" name="vehicleId" value={vehicle.id} />
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
            <span className="label-text">Total Miles</span>
            <input
              type="number"
              name="miles"
              placeholder={(vehicle.miles ?? undefined)?.toString()}
              min={vehicle.miles ?? undefined}
              // make min most recent miles
              max={vehicle.miles != null ? vehicle.miles + 1000 : undefined}
              // make max most recent + 1000 miles
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
          <div className="flex gap-2 mt-2">
            <button type="submit" className="btn btn-primary">
              Add Fill Up
            </button>
            {onClose && (
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
