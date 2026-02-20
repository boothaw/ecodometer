import { SkeletonList, Skeleton, SkeletonButton, SkeletonTitle } from "@/src/components/Skeleton";

export default function LoadingVehiclePage() {
  return (
    <>
              <div className="flex items-center justify-center font-body">
                 <main className="flex md:max-w-xl flex-col items-center justify-between py-16 px-0 mx-auto w-[90%] sm:items-start">
                   <div className="flex w-full flex-col items-center justify-center mx-auto gap-6 text-center">
                       <div className="card card-body flex justify-between w-full items-center flex-col gap-2">
                           <h1 className="max-w-xs text-3xl font-semibold text-navy font-display text-center leading-none w-full gap-2 flex-col flex">
                               <Skeleton />
                               <Skeleton small />
                           </h1>
                           <div className="flex justify-center w-full items-center justify-center">
                               <h2 className="text-2xl text-center w-full mx-auto flex justify-center"><Skeleton short /></h2>
                           </div>
                       </div>
                   
                           <SkeletonList amount={5}>
                             <div className="card w-full bg-white">
                               <div className="card-body">
                     
                                 <div className="card-title skeleton-title pb-2 justify-between gap-6 items-center">
                                     <Skeleton short /> <Skeleton short />
                                 </div>
                                 <div className="flex justify-between gap-2">
                                   <div className="flex flex-col gap-2">
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
           
                           <SkeletonButton white />
                       </div>
                   </div>
                 </main>
               </div>
    </>
  )
}