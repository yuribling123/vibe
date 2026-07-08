import { RateLimiterPrisma } from "rate-limiter-flexible"
import prisma from "./db"

export async function getUsageTracker() {

    const usageTracker = new RateLimiterPrisma(
        {
            storeClient: prisma,
            tableName: "Usage",
            points:5,
            duration:30*24*60*60, // 30 days
        }
    )

    return usageTracker

}