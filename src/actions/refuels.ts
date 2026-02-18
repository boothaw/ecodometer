"use server";

import { getVehicleIfOwnedByCurrentUser } from "@/src/lib/profile";
import { prisma } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function newRefuel(formData: FormData) {
  const vehicleId = Number(formData.get("vehicleId"));
  const gallons = Number(formData.get("gallons"));
  const miles = Number(formData.get("miles"));
  const date = new Date(formData.get("event-date") as string);

  const vehicle = await getVehicleIfOwnedByCurrentUser(vehicleId);
  if (!vehicle) throw new Error("Unauthorized");

  await prisma.refuel.create({
    data: {
      vehicleId: vehicle.id,
      gallons,
      miles,
      date,
    },
  });

  prisma.vehicle.update

  if (miles > vehicle.miles) {
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { miles },
    });
  }

  revalidatePath(`/profile/${vehicle.ownerId}/vehicle/${vehicle.id}`);
  redirect(`/profile/${vehicle.ownerId}/vehicle/${vehicle.id}`);
}
