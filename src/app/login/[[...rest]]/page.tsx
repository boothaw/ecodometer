import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
      <main className="flex min-h-screen max-w-3xl flex-col items-center justify-between py-16 px-0 mx-auto w-[90%] sm:items-start">
        <div className="flex flex-col items-center gap-.5 text-center sm:text-left mx-auto">
          <h1 className="max-w-xs text-5xl font-semibold leading-10 tracking-tight text-center dark:text-zinc-50 font-display m-0">
            Login
          </h1>
        </div>
        <div className="p-4 items-center justify-center m-auto flex-col flex gap-2">
         <SignIn  />
        </div>
      </main>
  );
}
