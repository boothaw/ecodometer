import { SignInButton, SignUpButton } from "@clerk/nextjs"

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center font-body">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-16 px-4 sm:items-start">
        <div className="flex flex-col items-center gap-.5 text-center sm:text-left mx-auto">
          <h1 className="max-w-xs text-5xl font-semibold leading-10 tracking-tight text-center dark:text-zinc-50 font-display m-0">
            Login
          </h1>
        </div>
        <div className="p-4 items-center justify-center m-auto flex-col flex gap-2">
          <SignInButton className="p-4 bg-blue text-white rounded-lg">Sign In</SignInButton>
          <SignUpButton className="p-4 bg-blue text-white rounded-lg">Sign up</SignUpButton>
        </div>
      </main>
    </div>
      )
  }