import { getProfileForCurrentUser, getVehicleIfOwnedByCurrentUser } from "@/src/lib/profile";
import { prisma } from "@/src/lib/db";
import { calcMpg } from "@/src/lib/mpg";
import Link from "next/link";
import { redirect } from "next/navigation";
import RefuelSection from "@/src/components/RefuelSection";
import RefuelList from "@/src/components/RefuelList";

type RawRefuel = {
  id: number;
  vehicleId: number;
  miles: number;
  gallons: { toNumber: () => number };
  date: Date;
  note: string | null;
  createdAt: Date;
};



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

  const [refuels, totalCount, allRefuelsForMpg] = await Promise.all([
    prisma.refuel.findMany({
      where: { vehicleId: vehicle.id },
      orderBy: [{ miles: "desc" }, { date: "desc" }],
      take: 11,
    }),
    prisma.refuel.count({ where: { vehicleId: vehicle.id } }),
    prisma.refuel.findMany({
      where: { vehicleId: vehicle.id },
      orderBy: [{ miles: "asc" }, { date: "asc" }],
      select: { miles: true, gallons: true },
    }),
  ]);

  // calcMpg expects asc order; allRefuelsForMpg is already asc.
  // Prepend a synthetic baseline using vehicle.miles so the first refuel shows MPG.
  const initialMiles = vehicle.initialMiles ?? vehicle.miles;
  const baselineMiles =
    allRefuelsForMpg.length > 0
      ? Math.min(initialMiles, allRefuelsForMpg[0].miles)
      : initialMiles;
  const baseline = { miles: baselineMiles, gallons: { toNumber: () => 0 } };
  const overallMpg = calcMpg([baseline, ...allRefuelsForMpg]);

  const serializedRefuels = (refuels as RawRefuel[]).map((r) => ({
    ...r,
    gallons: r.gallons.toNumber(),
    date: r.date.toISOString(),
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <>
    <div className="flex min-h-screen items-center justify-center font-body">
      <main className="flex min-h-screen md:max-w-xl flex-col items-center justify-between py-8 px-0 mx-auto w-[90%] sm:items-start">
        <div className="mx-auto w-full flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <div className="card card-body flex justify-between w-full items-center flex-col gap-2 overflow-hidden">
              <h1 className="max-w-xs text-3xl font-semibold text-navy font-display text-center leading-none flex flex-col justify-center items-center">
              <span className="animate-fade-in-right inline-block">{vehicle.name ?? "Vehicle"}</span>
              <div className="flex items-center gap-1 mx-auto"><span className="text-yellow text-base">=</span> <span className="text-base inline-block ">{makeModel && `${makeModel}`}</span> <span className="text-yellow text-base">=</span></div>
            </h1>
            <div className="flex justify-center w-full items-center">
                <h2 className="text-2xl text-center">{overallMpg ?? "—"} <span className="text-sm font-body font-bold">MPG</span></h2>
            </div>
          </div>

          <RefuelSection vehicle={vehicle} profileId={profileIdNum} />

          {totalCount === 0 ? (
            <p className="font-bold">No refuels yet.</p>
          ) : (
            <RefuelList
              initialRefuels={serializedRefuels}
              totalCount={totalCount}
              vehicleId={vehicleIdNum}
              profileId={profileIdNum}
              initialMiles={initialMiles}
            />
          )}
        </div>
      </main>
    </div>
    </>
  );
}
