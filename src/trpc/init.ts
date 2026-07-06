// trpc configuration file
import {auth} from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';

// all trpc procedures will have access to this clerk authorization
export const createTrpcContext = cache( async() => {
    return {auth: await auth()};  

})

export type Context = Awaited<ReturnType<typeof createTrpcContext>>;

 
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */ 
const t = initTRPC.context<Context>().create(
    {
        transformer: superjson, // optional - adds superjson serialization
    }
);

// authorization middleware for protected procedures
const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.auth.userId) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource',
        })
    }
    return next({
        ctx: {
            auth: ctx.auth,
        },
    });
}
)
 
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed)