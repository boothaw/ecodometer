import { Fragment, ReactNode } from "react"

export function Skeleton({
  short,
  inline,
  white,
}: {
  short?: boolean
  inline?: boolean
  white?: boolean
}) {
  return (
    <div
      className="skeleton"
      style={{
        width: short ? "8em" : undefined,
        display: inline ? "inline-block" : undefined,
        backgroundColor: white ? "#fff" : undefined,
      }}
    />
  )
}

export function SkeletonButton() {
  return <div className="skeleton skeleton-btn" />
}

export function SkeletonInput() {
  return <div className="skeleton skeleton-input" />
}

export function SkeletonList({
  amount,
  children,
}: {
  amount: number
  children: ReactNode
}) {
  return (
    <>
      {Array.from({ length: amount }).map((_, i) => (
        <Fragment key={i}>{children}</Fragment>
      ))}
    </>
  )
}
