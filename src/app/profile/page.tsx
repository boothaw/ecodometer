import { redirect } from "next/navigation";
import { getProfileForCurrentUser } from "@/src/lib/profile";

export default async function ProfileRedirect() {
  let profile;
  try {
    profile = await getProfileForCurrentUser();
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") redirect("/login");
    throw e;
  }
  redirect(`/profile/${profile.id}`);
}
