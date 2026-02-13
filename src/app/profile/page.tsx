import { redirect } from "next/navigation";
import { getProfileForCurrentUser } from "@/src/lib/profile";

export default async function ProfileRedirect() {
  const profile = await getProfileForCurrentUser();
  redirect(`/profile/${profile.id}`);
}
