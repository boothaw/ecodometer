import { Skeleton, SkeletonButton, SkeletonInput, SkeletonList, SkeletonTitle } from "@/src/components/Skeleton";

export default function LoadingNewVehiclePage() {
  return (
        <div className="skeleton-form flex items-center justify-center font-body">
          <main className="flex md:max-w-xl flex-col items-center justify-between py-16 px-0 mx-auto w-[90%] sm:items-start">
            <div className="card-body card bg-white flex flex-col mx-auto gap-6 text-center sm:text-left w-full">
              <h1 className="text-3xl font-semibold text-navy font-display card-title skelton-title pb-2">
                <SkeletonTitle short />
              </h1>
              <div className="flex flex-col gap-3">
                <SkeletonList amount={5}>
                  <div className="form-control w-full text-left flex flex-col gap-2">
                    <Skeleton short />
                    <SkeletonInput />
                  </div>
                </SkeletonList>
                <div className="flex gap-2 mt-2">
                  <SkeletonButton />
                  <SkeletonButton />
                </div>
              </div>
            </div>
          </main>
        </div> 
  );
}
