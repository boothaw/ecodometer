import { getProfileForCurrentUser } from "@/src/lib/profile";
import { prisma } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
// import { useParams } from 'next/navigation';
// import { newRefuel } from "../actions/refuels";

type RefuelFormProps = {
  vehicle: {
    id: number
    miles?: number | null
    date?: Date | null
    gallons?: number | null
  }
  profileId: number
}

export default function RefuelForm({ vehicle, profileId }: RefuelFormProps) {

  const id = profileId;

 const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, "0");

  const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;

  return (
    <div className="flex items-center justify-center font-body w-full">
        <div className="card-body card bg-white flex flex-col mx-auto gap-6 text-center sm:text-left w-full max-w-md">
          <h3 className="text-lg font-semibold text-navy font-display card-title">
            Fill Er' Up
          </h3>
          <form className="flex flex-col gap-3 form">
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
                // min={vehicle.miles}
                // make min most recent miles
                // max={vehicle.miles + 1000}
                // make max most recent + 1000 miles
                required
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control w-full" >
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
              {/* have cancel hide this form */}
              {/* <Link href={`/profile/${id}`} className="btn btn-ghost">
                Cancel
              </Link> */}
            </div>
          </form>
        </div>
    </div>
  );
}