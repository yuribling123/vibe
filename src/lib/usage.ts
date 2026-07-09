import { RateLimiterPrisma } from "rate-limiter-flexible"
import prisma from "./db"
import { auth } from "@clerk/nextjs/server";

const GENERATION_COST = 1; // cost of generating one image
const PRO_POINTS = 100

export async function getUsageTracker() {
    const {has}  = await auth();
    const hasProAccess = has({plan:"pro"})




    const usageTracker = new RateLimiterPrisma(
        {
            storeClient: prisma,
            tableName: "Usage",
            points: hasProAccess ? PRO_POINTS : 100,
            duration:30*24*60*60, // 30 days
        }
    )

    return usageTracker
}

export async function consumeCredits(){
    const {userId} = await auth();
    if (!userId){
        throw new Error("User not authenticated")
    }
    const usageTracker = await getUsageTracker();
    const result = await usageTracker.consume(userId,GENERATION_COST)
    return result
}

export async function getUsageStatus(){

    const {userId} = await auth();
    if (!userId){
        throw new Error("User not authenticated")
    }
    const UsageTracker = await getUsageTracker();
    const result = await UsageTracker.get(userId)
    return result

}