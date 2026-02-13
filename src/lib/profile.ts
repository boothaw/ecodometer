import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/db";
import type { Profile, Vehicle } from "@/src/generated/prisma/client";

/**
 * Get a vehicle by id only if it belongs to the current user's profile.
 * Returns null if not found or not owned.
 */
export async function getVehicleIfOwnedByCurrentUser(
  vehicleId: number
): Promise<(Vehicle & { owner: Profile }) | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      owner: { clerkUserId: userId },
    },
    include: { owner: true },
  });
  return vehicle;
}

/**
 * Get the current user's Profile from the DB (find or create by Clerk userId).
 * Requires the user to be signed in; throws if not.
 */
export async function getProfileForCurrentUser(): Promise<
  Profile & { vehicles: Vehicle[] }
> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: userId },
    include: { vehicles: true },
  });

  if (profile) {
    return profile;
  }

  const created = await prisma.profile.create({
    data: { clerkUserId: userId },
    include: { vehicles: true },
  });
  return created;
}

/**
 * Get profile by numeric id only if it belongs to the current user.
 * Returns null if not found or not owned by current user.
 */
export async function getProfileIfOwnedByCurrentUser(
  profileId: number
): Promise<(Profile & { vehicles: Vehicle[] }) | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const profile = await prisma.profile.findFirst({
    where: { id: profileId, clerkUserId: userId },
    include: { vehicles: true },
  });
  return profile;
}
