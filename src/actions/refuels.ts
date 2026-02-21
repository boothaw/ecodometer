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

  if (miles <= (vehicle.miles ?? 0)) {
    throw new Error(
      "Odometer reading must be greater than the current vehicle miles."
    );
  }

  await prisma.refuel.create({
    data: {
      vehicleId: vehicle.id,
      gallons,
      miles,
      date,
    },
  });

  if (miles > vehicle.miles) {
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { miles },
    });
  }

  revalidatePath(`/profile/${vehicle.ownerId}/vehicle/${vehicle.id}`);
  revalidatePath(`/profile/${vehicle.ownerId}`);
  revalidatePath(`/profile`, "layout");
  redirect(`/profile/${vehicle.ownerId}/vehicle/${vehicle.id}`);
}
