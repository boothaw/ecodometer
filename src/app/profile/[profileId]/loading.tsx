import { SkeletonList, Skeleton, SkeletonButton } from "@/src/components/Skeleton";

export default function LoadingProfilePage() {
  return (
    <>
    <div className="flex items-center justify-center font-body">
      <main className="flex md:max-w-xl flex-col items-center justify-between py-16 px-0 mx-auto w-[90%] sm:items-start">
        <div className="flex w-full flex-col items-center justify-center mx-auto gap-6 text-center">
              <h1 className="max-w-xs text-3xl font-semibold text-navy font-display w-full">
                    <Skeleton white  />
              </h1>

                <SkeletonList amount={2}>
                  <div className="card w-full bg-white">
                    <div className="card-body">
                      <div className="card-title skeleton-title justify-between gap-2 pb-2 flex-col md:flex-row md:gap-6">
                          <Skeleton /> <Skeleton />
                      </div>
                      <div className="flex justify-between gap-2">
                        <div className="flex flex-col gap-2">
                              <Skeleton short />
                            <Skeleton short />
                        </div>
                        <div className="card-actions justify-end">
                          <SkeletonButton />
                        </div>
                      </div>
                    </div>
                  </div>
                </SkeletonList>
         
            <div className="flex gap-2">

                <SkeletonButton />
            </div>
        </div>
      </main>
    </div>
    </>
  )
}