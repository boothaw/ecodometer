export default function Vehicles() {
  return (
    <div className="flex min-h-screen items-center justify-center font-body">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold text-navy font-display">
            Vehicle - change to id routing ? 
          </h1>
      <a className="btn-ghote" href="/new-vehicle">New Vehicle</a>
        </div>

      </main>
    </div>
  );
}
