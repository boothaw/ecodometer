import { getProfileForCurrentUser, getVehicleIfOwnedByCurrentUser } from "@/src/lib/profile";
import { prisma } from "@/src/lib/db";
import { calcMpg } from "@/src/lib/mpg";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RefuelCard } from "@/src/components/RefuelCard";
import RefuelForm from "@/src/components/RefuelForm";


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

          <details className="w-full group">
            <summary className="flex justify-between w-full items-center list-none cursor-pointer">
              <h3 className="text-lg text-left font-body font-bold">Need To Fill Up?</h3>
              <span className="btn btn-secondary">
                <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#7587a0"
                  >
                  <path d="m19.616 6.48.014-.017-4-3.24-1.26 1.554 2.067 1.674a2.99 2.99 0 0 0-1.394 3.062c.15.899.769 1.676 1.57 2.111.895.487 1.68.442 2.378.194L18.976 18a.996.996 0 0 1-1.39.922.995.995 0 0 1-.318-.217.996.996 0 0 1-.291-.705L17 16a2.98 2.98 0 0 0-.877-2.119A3 3 0 0 0 14 13h-1V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-4h1c.136 0 .267.027.391.078a1.028 1.028 0 0 1 .531.533A.994.994 0 0 1 15 16l-.024 2c0 .406.079.799.236 1.168.151.359.368.68.641.951a2.97 2.97 0 0 0 2.123.881c.406 0 .798-.078 1.168-.236.358-.15.68-.367.951-.641A2.983 2.983 0 0 0 20.976 18L21 9a2.997 2.997 0 0 0-1.384-2.52zM11 8H4V5h7v3zm7 2a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
              </span>
            </summary>
            <RefuelForm vehicle={vehicle} profileId={profileIdNum} />
          </details>

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

          <div className="flex justify-center w-full">
            <Link
              className="btn btn-primary"
              href={`/profile/${vehicle.ownerId}`}
            >
              Back to profile
            </Link>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
