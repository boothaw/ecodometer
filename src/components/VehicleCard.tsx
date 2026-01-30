import Link from "next/link"
import { Skeleton, SkeletonButton } from "./Skeleton"

export function VehicleCard() {
  return (
    <div className="card card-border w-full max-w-lg bg-white">
        <div className="card-body">
            <div className="card-title justify-between gap-6">
                <h2 className="text-xl text-left">Nickname: PennyRose PennyRose PennyRose PennyRose the destoyer</h2>
                <p className="text-right font-extrabold text-sm">Toyota - Tacoma</p>
            </div>
            <p className="text-left font-extrabold">MPG: xx.x</p>
            <p className="text-left font-extrabold">Miles: xx,xxx</p>
            <div className="card-actions justify-end">
            <Link href={"/profile/3/vehicle/33"} className="btn btn-primary">View Now</Link>
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
