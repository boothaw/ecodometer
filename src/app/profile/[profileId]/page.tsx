import { VehicleCard } from "@/src/components/VehicleCard";
import { getProfileForCurrentUser, getProfileIfOwnedByCurrentUser } from "@/src/lib/profile";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Profile({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;

  const myProfile = await getProfileForCurrentUser();

  if (profileId === "me") {
    redirect(`/profile/${myProfile.id}`);
  }

  const requestedId = Number(profileId);
  if (Number.isNaN(requestedId)) {
    redirect(`/profile/${myProfile.id}`);
  }

  const profile =
    requestedId === myProfile.id
      ? myProfile
      : await getProfileIfOwnedByCurrentUser(requestedId);

  if (!profile) {
    redirect(`/profile/${myProfile.id}`);
  }

  const displayName =
    profile.name ||
    (myProfile.id === profile.id ? "My profile" : undefined) ||
    "Profile";

  return (
    <div className="flex min-h-screen items-center justify-center font-body">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <div className="flex flex-col items-center justify-center mx-auto gap-6 text-center">
          <h1 className="max-w-xs text-3xl font-semibold text-navy font-display">
            {displayName}
          </h1>

          {profile.vehicles.length === 0 ? (
            <>
            <p className="text-base-content/80">No vehicles yet.</p>
            <Link href={`/profile/${profile.id}/vehicle/new`}>Add New Vehicle</Link>
            </>
          ) : (
            <ul className="flex flex-col gap-4 w-full">
              {profile.vehicles.map((vehicle) => (
                <li key={vehicle.id}>
                  <VehicleCard
                    vehicle={{
                      id: vehicle.id,
                      name: vehicle.name,
                      make: vehicle.make,
                      model: vehicle.model,
                      year: vehicle.year ?? undefined,
                      miles: vehicle.miles ?? undefined,
                    }}
                    profileId={profile.id}
                  />
                </li>
              ))}
            </ul>
          )}
            <div className="flex gap-2">
            <Link
              className="btn"
              href={`/profile/${profileId}/vehicle/new`}
            >
              New Vehicle
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
