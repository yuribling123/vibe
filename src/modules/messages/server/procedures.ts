import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { generateSlug } from "random-word-slugs";
// add a new message in the exisiting project and trigger the ai agent job
// (1) read from the DB (2)update the DB
// validate input -> save in database -> trigger job -> return response
// use trpc as safetype layer to call prisma database
export const messageRouter = createTRPCRouter({
  // get all messages from the database
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" })
      })
    )
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId
        },
        include:{fragment:true},
        orderBy: {
          updatedAt: "asc"
        },
      });
      return messages
    }),
  // create a new message in the database and trigger the ai agent job
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: "Value is required" }).max(10000, { message: "Value must be less than 10000 characters" }),
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input }) => {
      const createdMessage = await prisma.message.create({
        data: {
          projectId: input.projectId,
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });

      // call the inngest function to trigger the ai agent job
      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });

      return createdMessage;
    }),
});