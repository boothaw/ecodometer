import { getProfileForCurrentUser } from "@/src/lib/profile";
import { prisma } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function NewVehiclePage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const profile = await getProfileForCurrentUser();
  const profileIdNum = Number((await params).profileId);

  if (profileIdNum !== profile.id) {
    redirect(`/profile/${profile.id}/vehicle/new`);
  }

  async function createVehicle(formData: FormData) {
    "use server";
    const profile = await getProfileForCurrentUser();
    const name = (formData.get("name") as string) || null;
    const yearRaw = formData.get("year");
    const year = yearRaw ? Number(yearRaw) : null;
    const model = (formData.get("model") as string) || null;
    const make = (formData.get("make") as string) || null;
    const milesRaw = formData.get("miles");
    const miles = milesRaw != null && milesRaw !== "" ? Number(milesRaw) : 0;

    await prisma.vehicle.create({
      data: {
        ownerId: profile.id,
        name: name || undefined,
        year: year ?? undefined,
        model: model || undefined,
        make: make || undefined,
        miles,
      },
    });
    revalidatePath(`/profile/${profile.id}`) 
    redirect(`/profile/${profile.id}`);
  }

  const currentYearPlusOne = new Date().getFullYear() + 1;

  return (
    <div className="flex min-h-screen items-center justify-center font-body">
      <main className="flex min-h-screen max-w-3xl flex-col items-center justify-between py-16 px-0 mx-auto w-[90%] sm:items-start">
        <div className="card-body card bg-white flex flex-col mx-auto gap-6 text-center sm:text-left w-full max-w-md">
          <h1 className="text-3xl font-semibold text-navy font-display card-title">
            New Vehicle
          </h1>
          <form action={createVehicle} className="flex flex-col gap-3 form">
            <label className="form-control w-full">
              <span className="label-text">Nickname</span>
              <input
                type="text"
                name="name"
                placeholder="e.g. Daily driver"
                required
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text">Make</span>
              <input
                type="text"
                name="make"
                placeholder="e.g. Toyota"
                required
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text">Model</span>
              <input
                type="text"
                name="model"
                placeholder="e.g. Tacoma"
                required
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text">Year</span>
              <input
                type="number"
                name="year"
                placeholder="e.g. 2020"
                min={1900}
                max={currentYearPlusOne}
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
                Add vehicle
              </button>
              <Link href={`/profile/${profile.id}`} className="btn btn-ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
