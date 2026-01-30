import Link from "next/link"
import { Skeleton, SkeletonButton } from "./Skeleton"

export function VehicleCard() {
  return (
    <div className="card card-border bg-base-100 w-96">
        <div className="card-body">
            <h2 className="card-title text-2xl text-left">Nickname</h2>
            <p className="text-left font-extrabold">Toyota - Tacoma</p>
            <p className="text-left font-extrabold">MPG: xx.x</p>
            <p className="text-left font-extrabold">Miles: xx,xxx</p>
            <div className="card-actions justify-end">
            <button className="btn btn-primary">View Now</button>
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
