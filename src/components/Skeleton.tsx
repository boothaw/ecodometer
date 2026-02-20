import { Fragment, ReactNode } from "react"

export function Skeleton({
  short,
  inline,
  white,
  small,
}: {
  short?: boolean
  inline?: boolean
  white?: boolean
  small?: boolean
}) {
  return (
    <div
      className="skeleton"
      style={{
        width: short ? "6em" : undefined,
        display: inline ? "inline-block" : undefined,
        background: white ? "#fff !important" : undefined,
        height: small ? ".75em" : undefined,
      }}
    />
  )
}

export function SkeletonButton({
  white,
}: {
  white?: boolean
}) {
  return <div style={{
        background: white ? "#fff" : undefined,
      }} className="skeleton skeleton-btn" />
}

export function SkeletonInput() {
  return <div className="skeleton skeleton-input" />
}

export function SkeletonTitle({
  white,
  gray,
  short,
}: {
  white?: boolean
  gray?: boolean
  short?: boolean
}) {
  return <div style={{
        background: white ? "#fff" : undefined,
        backgroundColor: gray ? "#c8ccc133" : undefined,
        width: short ? "6em" : undefined,
      }} className="skeleton skeleton-title" />
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
