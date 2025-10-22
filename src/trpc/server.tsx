import 'server-only'; // <--- ensure this file cannot be imported from the client
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTrpcContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';
 
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTrpcContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(createTrpcContext);
// directly  call database queries on the server   
    