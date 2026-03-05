"use server";

import { getProfileForCurrentUser, getVehicleIfOwnedByCurrentUser } from "@/src/lib/profile";
import { prisma } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createVehicle(formData: FormData) {
  const profile = await getProfileForCurrentUser();
  const name = (formData.get("name") as string) || null;
  const yearRaw = formData.get("year");
  const year = yearRaw ? Number(yearRaw) : null;
  const model = (formData.get("model") as string) || null;
  const make = (formData.get("make") as string) || null;
  const milesRaw = formData.get("miles");
  const miles = milesRaw != null && milesRaw !== "" ? Number(milesRaw) : 0;

  await prisma.vehicle.create({
    data: {
      ownerId: profile.id,
      name: name || undefined,
      year: year ?? undefined,
      model: model || undefined,
      make: make || undefined,
      miles,
      initialMiles: miles,
    },
  });

  revalidatePath(`/profile/${profile.id}`);
  revalidatePath(`/profile`, "layout");
  redirect(`/profile/${profile.id}`);
}

export async function deleteVehicle(formData: FormData) {
  const vehicleId = Number(formData.get("vehicleId"));

  const vehicle = await getVehicleIfOwnedByCurrentUser(vehicleId);
  if (!vehicle) throw new Error("Unauthorized");

  await prisma.vehicle.delete({ where: { id: vehicle.id } });

  revalidatePath(`/profile/${vehicle.ownerId}`);
  revalidatePath(`/profile`, "layout");
  redirect(`/profile/${vehicle.ownerId}`);
}
