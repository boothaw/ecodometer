import { VehicleCard } from "@/src/components/VehicleCard";
import { clerkClient } from '@clerk/nextjs/server';


export default async function Profile({
  params,
}: {
  params: Promise<{ profileId: string }>
}) {

    const {profileId} = await params

    // console.log(profileId)

    // async function getUserData(userId) {
    //   const user = await clerkClient.users.getUser(userId);
    //   console.log(user.username); // Or user.primaryEmailAddress.emailAddress
    //   return user;
    // }


  return (
    <div className="flex min-h-screen items-center justify-center font-body">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <div className="flex flex-col items-center justify-center mx-auto gap-6 text-center">
          <h1 className="max-w-xs text-3xl font-semibold text-navy font-display">
            Profile/Vehicles Id:<br></br>{profileId} & 
          </h1>

          <VehicleCard />
          <VehicleCard />
          <VehicleCard />
          <VehicleCard />
      
        </div>

      </main>
    </div>
  );
}
