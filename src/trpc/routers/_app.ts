import { createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
import { messagesRouter } from '@/modules/messages/server/procedures';

// group of apis related to messages
export const appRouter = createTRPCRouter({
  messages: messagesRouter,
})

export type AppRouter = typeof appRouter; 