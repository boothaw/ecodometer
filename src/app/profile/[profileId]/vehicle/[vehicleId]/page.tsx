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
              <span className="btn btn-primary">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.75 2H9.75C12.5784 2 13.9926 2 14.8713 2.87868C15.75 3.75736 15.75 5.17157 15.75 8V16.25H17.3214C18.5246 16.25 19.5 17.2254 19.5 18.4286V18.5C19.5 18.9142 19.8358 19.25 20.25 19.25C20.6642 19.25 21 18.9142 21 18.5V13.75L19.7757 13.3419C19.1631 13.1377 18.75 12.5645 18.75 11.9189V9.5C18.75 8.67157 19.4216 8 20.25 8H21V7.62247C21 7.43743 20.9997 7.37384 20.9965 7.31573C20.9631 6.72114 20.6953 6.16405 20.2519 5.76653C20.2085 5.72768 20.1591 5.68774 20.0146 5.57215L18.7815 4.58568C18.458 4.32692 18.4056 3.85495 18.6643 3.53151C18.9231 3.20806 19.3951 3.15562 19.7185 3.41438L20.9678 4.41378C21.0901 4.51163 21.1745 4.57915 21.2531 4.64962C21.9922 5.31214 22.4384 6.24063 22.4941 7.23161C22.5 7.33702 22.5 7.44511 22.5 7.60177V18.5C22.5 19.7427 21.4926 20.75 20.25 20.75C19.0074 20.75 18 19.7427 18 18.5V18.4286C18 18.0538 17.6962 17.75 17.3214 17.75H15.75V21.25H16.8734C17.2876 21.25 17.6234 21.5858 17.6234 22C17.6234 22.4142 17.2876 22.75 16.8734 22.75H1.75C1.33579 22.75 1 22.4142 1 22C1 21.5858 1.33579 21.25 1.75 21.25H2.75V8C2.75 5.17157 2.75 3.75736 3.62868 2.87868C4.50736 2 5.92157 2 8.75 2ZM7 16.25C6.58579 16.25 6.25 16.5858 6.25 17C6.25 17.4142 6.58579 17.75 7 17.75H12C12.4142 17.75 12.75 17.4142 12.75 17C12.75 16.5858 12.4142 16.25 12 16.25H7ZM11 6H8C7.05719 6 6.58579 6 6.29289 6.29289C6 6.58579 6 7.05719 6 8C6 8.94281 6 9.41421 6.29289 9.70711C6.58579 10 7.05719 10 8 10H11C11.9428 10 12.4142 10 12.7071 9.70711C13 9.41421 13 8.94281 13 8C13 7.05719 13 6.58579 12.7071 6.29289C12.4142 6 11.9428 6 11 6Z" fill="#fff"/>
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
  );
}
