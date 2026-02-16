import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
export const appRouter = createTRPCRouter({
  invoke: baseProcedure
     .input( // validate input type
      z.object({
        value: z.string(),
      }), 
     )
     .mutation(async({input}) => { // action to perform
      await inngest.send(
        {
          name: "test/hello.world", // event key trigger the inggest function
          data:{
            value: input.value,
          } 
        } 
      )
      return {ok:"success"}
     }),
  createAI: baseProcedure //name of api endpoint
    .input(
      z.object({
        text: z.number(),
      }),
    ) 
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});

// export type definition of  API
export type AppRouter = typeof appRouter;
