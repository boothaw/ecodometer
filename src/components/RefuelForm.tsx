import { getProfileForCurrentUser } from "@/src/lib/profile";
import { prisma } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
// import { useParams } from 'next/navigation';
import { newRefuel } from "../actions/refuels";

export default async function RefuelForm({
  params,
}: {
  params: Promise<{ vehicle: object }>;
}) {
  const profile = await getProfileForCurrentUser();
  // const profileIdNum = Number((await params).profileId);

    // const profileIdNum = useParams();


  // if (profileIdNum !== profile.id) {
  //   redirect(`/profile/${profile.id}/vehicle/new`);
  // }

//   const currentYearPlusOne = new Date().getFullYear() + 1;

  return (
    <div className="flex min-h-screen items-center justify-center font-body">
        <div className="card-body card bg-white flex flex-col mx-auto gap-6 text-center sm:text-left w-full max-w-md">
          <h3 className="text-lg font-semibold text-navy font-display card-title">
            Fill Er' Up
          </h3>
          <form action={newRefuel} className="flex flex-col gap-3 form">
            <label className="form-control w-full" >
              <span className="label-text">Date</span>
                <input className="input input-bordered w-full" type="datetime-local" id="event-date" name="event-date" required />
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
                // make min most recent miles
                max={500000}
                // make max most recent + 1000 miles
                required
                className="input input-bordered w-full"
              />
            </label>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="btn btn-primary">
                Add Fill Up
              </button>
              <Link href={`/profile/${profile.id}`} className="btn btn-ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
    </div>
  );
}