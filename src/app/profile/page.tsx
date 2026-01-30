import { VehicleCard } from "@/src/components/VehicleCard";

export default function Profile() {
  return (
    <div className="flex min-h-screen items-center justify-center font-body">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <div className="flex flex-col items-center justify-center mx-auto gap-6 text-center">
          <h1 className="max-w-xs text-3xl font-semibold text-navy font-display">
            Profile/Vehicles
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
