import { getProfileForCurrentUser, getVehicleIfOwnedByCurrentUser } from "@/src/lib/profile";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ profileId: string; vehicleId: string }>;
}) {
  const { profileId, vehicleId } = await params;

  const myProfile = await getProfileForCurrentUser();
  const profileIdNum = Number(profileId);
  const vehicleIdNum = Number(vehicleId);

  if (Number.isNaN(vehicleIdNum)) {
    redirect(`/profile/${myProfile.id}`);
  }

  const vehicle = await getVehicleIfOwnedByCurrentUser(vehicleIdNum);
  if (!vehicle) {
    redirect(`/profile/${myProfile.id}`);
  }

  if (Number.isNaN(profileIdNum) || vehicle.ownerId !== profileIdNum) {
    redirect(`/profile/${vehicle.ownerId}/vehicle/${vehicle.id}`);
  }

  const makeModel = [vehicle.make, vehicle.model].filter(Boolean).join(" ") || "—";

  return (
    <div className="flex min-h-screen items-center justify-center font-body">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <div className="mx-auto flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold text-navy font-display">
            {vehicle.name ?? "Vehicle"} {makeModel && `— ${makeModel}`}
          </h1>
          {vehicle.year != null && (
            <p className="text-base-content/80">Year: {vehicle.year}</p>
          )}
          {vehicle.miles != null && (
            <p className="text-base-content/80">
              Miles: {vehicle.miles.toLocaleString()}
            </p>
          )}
          <div className="flex gap-2">
            <Link
              className="btn btn-primary"
              href={`/profile/${vehicle.ownerId}`}
            >
              Back to profile
            </Link>
            <Link
              className="btn"
              href={`/profile/${vehicle.ownerId}/vehicle/new`}
            >
              New Vehicle
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
