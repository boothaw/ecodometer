import { getProfileForCurrentUser, getVehicleIfOwnedByCurrentUser } from "@/src/lib/profile";
import { prisma } from "@/src/lib/db";
import { calcMpg } from "@/src/lib/mpg";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RefuelCard } from "@/src/components/RefuelCard";
import VehicleStats from "@/src/components/VehicleStats";


export default async function VehiclePage({
  params,
}: {
  params: Promise<{ profileId: string; vehicleId: string }>;
}) {
  const { profileId, vehicleId } = await params;

  let myProfile;
  try {
    myProfile = await getProfileForCurrentUser();
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") redirect("/login");
    throw e;
  }
  const profileIdNum = Number(profileId);
  const vehicleIdNum = Number(vehicleId);

  // do I need these conditionals below?

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

  const refuels = await prisma.refuel.findMany({
    where: { vehicleId: vehicle.id },
    orderBy: [{ miles: "desc" }, { date: "desc" }],
  });

  // calcMpg expects asc order; refuels are fetched desc, so reverse a copy.
  // Prepend a synthetic baseline using vehicle.miles so the first refuel shows MPG.
  const refuelsAsc = [...refuels].reverse();
  const initialMiles = vehicle.initialMiles ?? vehicle.miles;
  const baselineMiles =
    refuelsAsc.length > 0
      ? Math.min(initialMiles, refuelsAsc[0].miles)
      : initialMiles;
  const baseline = { miles: baselineMiles, gallons: { toNumber: () => 0 } };
  const overallMpg = calcMpg([baseline, ...refuelsAsc]);

  // Recent MPG: last 10 refuels + baseline from 11th
  const recentSlice = refuels.slice(0, 10); // most recent 10 (desc order)
  const baselineForRecent = refuels[10]; // 11th refuel provides baseline
  const recentBaselineMiles = baselineForRecent?.miles ?? baselineMiles;
  const recentBaseline = { miles: recentBaselineMiles, gallons: { toNumber: () => 0 } };
  const recentMpg = calcMpg([recentBaseline, ...recentSlice.reverse()]);

  return (
    <>
    <div className="flex min-h-screen items-center justify-center font-body">
      <main className="flex min-h-screen md:max-w-xl flex-col items-center justify-between py-8 px-0 mx-auto w-[90%] sm:items-start">
        <div className="mx-auto w-full flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <VehicleStats
            vehicleName={vehicle.name ?? null}
            makeModel={makeModel}
            overallMpg={overallMpg}
            recentMpg={recentMpg}
            vehicle={vehicle}
            profileId={profileIdNum}
          />

          {refuels.length === 0 ? (
            <p className="font-bold">No refuels yet.</p>
          ) : (
            <ul className="flex flex-col gap-4 w-full">
              {refuels.map((refuel, i) => {
                const isOldest = i === refuels.length - 1;
                const prevMiles = isOldest
                  ? initialMiles
                  : refuels[i + 1]?.miles ?? null;
                const nextMiles = i === 0 ? null : refuels[i - 1]?.miles ?? null;
                // refuels are sorted desc by miles; the entry at i+1 has lower
                // miles and is therefore the chronologically prior refuel.
                const prevDate = refuels[i + 1]?.date ?? null;

                return (
                  <li key={refuel.id}>
                    <RefuelCard
                      refuel={{ ...refuel, gallons: refuel.gallons.toNumber() }}
                      prevMiles={prevMiles}
                      nextMiles={nextMiles}
                      prevDate={prevDate}
                      profileId={profileIdNum}
                      vehicleId={vehicleIdNum}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
    </>
  );
}
