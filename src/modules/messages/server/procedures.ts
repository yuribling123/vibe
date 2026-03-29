import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { generateSlug } from "random-word-slugs";
// backend endpoints
// (1) read from the DB (2)update the DB
// validate input -> save in database -> trigger job -> return response
// use trpc as safetype layer to call prisma database
export const projectRouter = createTRPCRouter({
  // get all messages from the database
  getMany: baseProcedure
    .query(async () => {
      const projects = await prisma.project.findMany({
        orderBy: {
          updatedAt: "asc"
        },
        // include:{
        //   fragment:true
        // }
      });
      return projects
    }),
  // create a new message in the database and trigger the ai agent job
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: "Message is required" }),
      })
    )
    .mutation(async ({ input }) => {
      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(2, { format: "kebab" }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      // call the inngest function to trigger the ai agent job
      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),
});