import { createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
import { messageRouter } from '@/modules/messages/server/procedures';
import { projectRouter } from '@/modules/projects/server/procedures';
import { usageRouter } from '@/modules/usage/server/procedures';

// group of apis related to messages
export const appRouter = createTRPCRouter({
  messages: messageRouter,
  projects: projectRouter,
  usage: usageRouter
})

export type AppRouter = typeof appRouter; 