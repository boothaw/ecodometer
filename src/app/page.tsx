import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center font-body">
      <main className="flex md:max-w-xl flex-col items-center justify-between py-16 px-0 mx-auto w-[90%] sm:items-start">
        <div className="flex flex-col items-center gap-.5 text-center sm:items-start sm:text-left mx-auto">
          <h1 className="max-w-xs text-5xl font-semibold leading-10 tracking-tight text-center   font-display m-0">
            ECOdometer
          </h1>
          <p className="text-xl text-center uppercase text-navy mx-auto"><span className="text-yellow">=</span> Running From Empty <span className="text-yellow">=</span></p>
        </div>
      </main>
    </div>
  );
}
