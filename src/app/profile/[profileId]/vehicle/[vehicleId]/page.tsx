export default async function Vehicles({
  params,
}: {
  params: Promise<{ profileId: string; vehicleId: string }>
}) {

  const { profileId, vehicleId } = await params

  return (
    <div className="flex min-h-screen items-center justify-center font-body">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <div className="mx-auto flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold text-navy font-display">
            Vehicle - ID: {vehicleId} <br></br> (Profile: {profileId})
          </h1>
      <a className="btn" href="/new-vehicle">New Vehicle</a>
        </div>

      </main>
    </div>
  );
}
