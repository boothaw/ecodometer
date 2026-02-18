// "use server";

// import { getProfileForCurrentUser } from "@/src/lib/profile";
// import { prisma } from "@/src/lib/db";
// import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";


// export async function newRefuel(formData: FormData) {


//     const refuel = await createRefuel({
//         miles: Number(formData.get("gallons")),
//         gallons: Number(formData.get("gallons"))
//         // profileId: 
//     })


//     revalidatePath(`/profile/${profile.id}`) 
//     redirect(`/profile/${profile.id}`);
// }