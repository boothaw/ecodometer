import { VehicleCard } from "@/src/components/VehicleCard";
import { getProfileForCurrentUser, getProfileIfOwnedByCurrentUser } from "@/src/lib/profile";
import { prisma } from "@/src/lib/db";
import { calcMpg } from "@/src/lib/mpg";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function Profile({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;

  let myProfile;
  try {
    myProfile = await getProfileForCurrentUser();
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") redirect("/login");
    throw e;
  }

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
    (myProfile.id === profile.id ? "My Profile" : undefined) ||
    "Profile";

  // Fetch all refuels for this profile's vehicles in one query (asc for calcMpg)
  const vehicleIds = profile.vehicles.map((v) => v.id);
  const allRefuels = vehicleIds.length > 0
    ? await prisma.refuel.findMany({
        where: { vehicleId: { in: vehicleIds } },
        orderBy: [{ miles: "asc" }, { date: "asc" }],
        select: { vehicleId: true, miles: true, gallons: true },
      })
    : [];

  const mpgByVehicleId = new Map<number, string | null>();
  for (const vehicle of profile.vehicles) {
    const vRefuels = allRefuels.filter((r) => r.vehicleId === vehicle.id);
    const vehicleMiles = vehicle.initialMiles ?? vehicle.miles;
    const baselineMiles =
      vRefuels.length > 0
        ? Math.min(vehicleMiles, vRefuels[0].miles)
        : vehicleMiles;
    const baseline = { miles: baselineMiles, gallons: { toNumber: () => 0 } };
    mpgByVehicleId.set(vehicle.id, calcMpg([baseline, ...vRefuels]));
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center font-body">
      <main className="min-h-screen flex md:max-w-xl flex-col items-center justify-between py-8 px-0 mx-auto w-[90%] sm:items-start">
        <div className="flex w-full flex-col items-center justify-center mx-auto gap-6 text-center">
              <h1 className="animate-fade-in-right max-w-xs text-3xl font-semibold text-navy font-display">
                  {displayName}
              </h1>

                {profile.vehicles.length === 0 ? (
                  <>
                  <p className="font-bold">No vehicles yet.</p>
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
                          mpg={mpgByVehicleId.get(vehicle.id) ?? null}
                          profileId={profile.id}
                        />
                      </li>
                    ))}
                  </ul>
                )}
            <div className="flex gap-2">
            <Link
              className="btn btn-primary"
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
