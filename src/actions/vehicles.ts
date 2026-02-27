"use server";

import { getVehicleIfOwnedByCurrentUser } from "@/src/lib/profile";
import { prisma } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function deleteVehicle(formData: FormData) {
  const vehicleId = Number(formData.get("vehicleId"));

  const vehicle = await getVehicleIfOwnedByCurrentUser(vehicleId);
  if (!vehicle) throw new Error("Unauthorized");

  await prisma.vehicle.delete({ where: { id: vehicle.id } });

  revalidatePath(`/profile/${vehicle.ownerId}`);
  revalidatePath(`/profile`, "layout");
  redirect(`/profile/${vehicle.ownerId}`);
}
