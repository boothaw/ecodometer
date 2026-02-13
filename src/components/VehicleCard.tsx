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
  profileId: number
}

export function VehicleCard({ vehicle, profileId }: VehicleCardProps) {
  const nickname = vehicle.name ?? "Unnamed"
  const makeModel = [vehicle.make, vehicle.model].filter(Boolean).join(" - ") || "—"
  const milesDisplay =
    vehicle.miles != null ? vehicle.miles.toLocaleString() : "—"
  return (
    <div className="card card-border w-100 max-w-2xl bg-white">
        <div className="card-body">
            <div className="card-title justify-between gap-6">
                <h2 className="text-2xl text-left">{nickname}</h2>
                <p className="text-right font-extrabold text-sm">{makeModel}</p>
            </div>
            <div className="flex-col">
              <p className="text-left font-extrabold">MPG: xx.x</p>
              <p className="text-left font-extrabold">Miles: {milesDisplay}</p>
              </div>
              <div className="card-actions justify-end">
              <Link href={`/profile/${profileId}/vehicle/${vehicle.id}`} className="btn btn-primary">View Now</Link>
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
