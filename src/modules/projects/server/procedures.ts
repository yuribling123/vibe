import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

// create a new project with first message and trigger the ai agent job
export const projectRouter = createTRPCRouter({
  // get a project by id, include messages
  getOne:baseProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Project ID is required" })
      })
    )
    .query(async ({ input }) => {
      const project = await prisma.project.findUnique({
        where: {
          id: input.id
        },
        include:{
          messages:true
        }
      });
      if(!project){
        throw new TRPCError({code:"NOT_FOUND",message:"Project not found"})
      }
      return project 
    }), 
  // get all projects from the database
  getMany: baseProcedure
    .query(async () => { 
      const projects = await prisma.project.findMany({
        orderBy: {
          updatedAt: "asc"
        },
      });
      return projects
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: "Value is required" }).max(10000, { message: "Value must be less than 10000 characters" }),

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