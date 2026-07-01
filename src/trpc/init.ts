import {auth} from '@clerk/nextjs/server';
import { initTRPC } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';

// secure trppc
export const createTrpcContext = cache( async() => {

    return {auth: await auth()};  

})

export type Context = Awaited<ReturnType<typeof createTrpcContext>>;
 
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create(
    {
        transformer: superjson, // optional - adds superjson serialization
    }
);
 
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure;
 