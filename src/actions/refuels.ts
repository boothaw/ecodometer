"use server";

import { getVehicleIfOwnedByCurrentUser } from "@/src/lib/profile";
import { prisma } from "@/src/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function parseDateInput(value: string): Date {
  // HTML date inputs return YYYY-MM-DD. Parsing this string directly with
  // new Date() treats it as UTC midnight, which can shift the displayed date
  // by a day in negative-offset timezones. Appending T12:00:00Z keeps the
  // date stable regardless of server timezone.
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

export async function newRefuel(formData: FormData) {
  const vehicleId = Number(formData.get("vehicleId"));
  const gallons = Number(formData.get("gallons"));
  const miles = Number(formData.get("miles"));
  const date = parseDateInput(formData.get("event-date") as string);
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
  const date = parseDateInput(formData.get("event-date") as string);
  const rawNote = (formData.get("note") as string).trim();
  const note = rawNote ? rawNote.slice(0, 75) : null;

  const vehicle = await getVehicleIfOwnedByCurrentUser(vehicleId);
  if (!vehicle) throw new Error("Unauthorized");

  const existing = await prisma.refuel.findUnique({ where: { id: refuelId } });
  if (!existing || existing.vehicleId !== vehicle.id) throw new Error("Unauthorized");

  // Server-side date validation: date must not be before the previous refuel's date.
  // "Previous" means the refuel with the next-lower miles value for this vehicle.
  const prevRefuel = await prisma.refuel.findFirst({
    where: {
      vehicleId: vehicle.id,
      miles: { lt: miles },
      id: { not: refuelId },
    },
    orderBy: { miles: "desc" },
  });

  if (prevRefuel && date < prevRefuel.date) {
    throw new Error(
      "Date cannot be earlier than the previous refuel's date."
    );
  }

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
