import { createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
import { messageRouter } from '@/modules/messages/server/procedures';
import { projectRouter } from '@/modules/projects/server/procedures';

// group of apis related to messages
export const appRouter = createTRPCRouter({
  messages: messageRouter,
  projects: projectRouter
})

export type AppRouter = typeof appRouter; 