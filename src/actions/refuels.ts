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
  const rawNote = (formData.get("note") as string).trim();
  const note = rawNote ? rawNote.slice(0, 75) : null;

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
      note,
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

export async function editRefuel(formData: FormData) {
  const refuelId = Number(formData.get("refuelId"));
  const vehicleId = Number(formData.get("vehicleId"));
  const gallons = Number(formData.get("gallons"));
  const miles = Number(formData.get("miles"));
  const date = new Date(formData.get("event-date") as string);
  const rawNote = (formData.get("note") as string).trim();
  const note = rawNote ? rawNote.slice(0, 75) : null;

  const vehicle = await getVehicleIfOwnedByCurrentUser(vehicleId);
  if (!vehicle) throw new Error("Unauthorized");

  const existing = await prisma.refuel.findUnique({ where: { id: refuelId } });
  if (!existing || existing.vehicleId !== vehicle.id) throw new Error("Unauthorized");

  await prisma.refuel.update({
    where: { id: refuelId },
    data: { gallons, miles, date, note },
  });

  const maxRefuel = await prisma.refuel.findFirst({
    where: { vehicleId: vehicle.id },
    orderBy: { miles: "desc" },
  });
  if (maxRefuel) {
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { miles: maxRefuel.miles },
    });
  }

  revalidatePath(`/profile/${vehicle.ownerId}/vehicle/${vehicle.id}`);
  revalidatePath(`/profile/${vehicle.ownerId}`);
  revalidatePath(`/profile`, "layout");
}
