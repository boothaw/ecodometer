import Link from "next/link"
import { Skeleton, SkeletonButton } from "./Skeleton"

type VehicleCardProps = {
  vehicle: {
    id: number
    name?: string | null
    make?: string | null
    model?: string | null
    year?: number | null
    miles?: number | null
  }
  mpg?: string | null
  profileId: number
}

export function VehicleCard({ vehicle, mpg, profileId }: VehicleCardProps) {
  const nickname = vehicle.name ?? "Unnamed"
  const makeModel = [vehicle.make, vehicle.model].filter(Boolean).join(" - ") || "—"
  const milesDisplay =
    vehicle.miles != null ? vehicle.miles.toLocaleString() : "—"
  return (
    <div className="card card-border w-full bg-white">
        <div className="card-body gap-2">
            <div className="card-title justify-between gap-2 pb-2 flex-col md:flex-row md:gap-6">
                <h2 className="text-center text-2xl md:w-3/5 md:text-left">{nickname}</h2>
                <p className="text-center font-extrabold text-sm md:w-2/5 md:text-right">{makeModel}</p>
            </div>
            <div className="flex justify-between gap-2">
              <div className="flex-col">
                <p className="text-left font-extrabold">MPG: {mpg ?? "—"}</p>
                <p className="text-left font-extrabold">Miles: {milesDisplay}</p>
                </div>
                <div className="card-actions justify-end">
                <Link href={`/profile/${profileId}/vehicle/${vehicle.id}`} className="btn btn-primary" prefetch={false}>View Now</Link>
              </div>
            </div>
        </div>
    </div>
  )
}

export function SkeletonVehicleCard() {
  return (
    <div className="card">
      <div className="card-header">
        <Skeleton short />
      </div>
      <div className="card-body">
        <div className="card-preview-text">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
      <div className="card-footer">
        <SkeletonButton />
      </div>
    </div>
  )
}
