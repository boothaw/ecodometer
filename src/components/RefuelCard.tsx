import Link from "next/link"
import { Skeleton, SkeletonButton } from "./Skeleton"

type RefuelCardProps = {
  vehicle: {
    id: number
    miles?: number | null
  }
  profileId: number
}

export function RefuelCard({ vehicle, profileId }: RefuelCardProps) {
  const milesDisplay =
    vehicle.miles != null ? vehicle.miles.toLocaleString() : "—"
  return (
    <div className="card card-border w-100 max-w-2xl bg-white">
        <div className="card-body">
            <div className="card-title justify-between gap-6">
                <h2 className="text-2xl text-left">XX.X <span className="text-sm">MPG</span></h2>
                <p className="text-right font-extrabold text-sm">{milesDisplay}</p>
            </div>
            <div className="flex justify-between gap-2">
            <div className="flex-col">
              <p className="text-left font-extrabold">Example Notes: This was a rough day on the beach. Lots of 4x4 driving.</p>
            </div>
            <div className="card-actions justify-end">
              <Link href="#" className="btn btn-primary">Edit</Link>
            </div>
            </div>
        </div>
    </div>
  )
}

export function SkeletonRefuelCard() {
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
