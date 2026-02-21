import { getProfileForCurrentUser, getVehicleIfOwnedByCurrentUser } from "@/src/lib/profile";
import { prisma } from "@/src/lib/db";
import { calcMpg } from "@/src/lib/mpg";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RefuelCard } from "@/src/components/RefuelCard";
import RefuelSection from "@/src/components/RefuelSection";


export default async function VehiclePage({
  params,
}: {
  params: Promise<{ profileId: string; vehicleId: string }>;
}) {
  const { profileId, vehicleId } = await params;

  const myProfile = await getProfileForCurrentUser();
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
    orderBy: { date: "desc" },
  });

  // calcMpg expects asc order; refuels are fetched desc, so reverse a copy
  const overallMpg = calcMpg([...refuels].reverse());

  return (
    <>
    <div className="flex items-center justify-center font-body">
      <main className="flex md:max-w-xl flex-col items-center justify-between py-16 px-0 mx-auto w-[90%] sm:items-start">
        <div className="mx-auto w-full flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <div className="card card-body flex justify-between w-full items-center flex-col gap-2">
              <h1 className="max-w-xs text-3xl font-semibold text-navy font-display text-center  leading-none">
              {vehicle.name ?? "Vehicle"}<br></br>
              <span className="text-yellow text-base">=</span> <span className="text-base">{makeModel && `${makeModel}`}</span> <span className="text-yellow text-base">=</span>
            </h1>
            <div className="flex justify-center w-full items-center">
                <h2 className="text-2xl text-center">{overallMpg ?? "—"} <span className="text-sm font-body font-bold">MPG</span></h2>
            </div>
          </div>

          <RefuelSection vehicle={vehicle} profileId={profileIdNum} />

          {refuels.length === 0 ? (
            <p className="text-base-content/80">No refuels yet.</p>
          ) : (
            <ul className="flex flex-col gap-4 w-full">
              {refuels.map((refuel, i) => (
                <li key={refuel.id}>
                  <RefuelCard
                    refuel={refuel}
                    prevMiles={refuels[i + 1]?.miles ?? null}
                    profileId={profileIdNum}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
    </>
  );
}
