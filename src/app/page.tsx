
import { useTRPC } from "@/trpc/client";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary} from "@tanstack/react-query";
import { text } from "stream/consumers";
import { Client } from "./client";
import { Suspense } from "react";
// the moment sever component load, client will prefetch the data 
// back ground job
const Page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.createAI.queryOptions({ text: 123 }));
  // const trpc = useTRPC();
  // const {data} = useQuery(trpc.createAI.queryOptions({ text: 123 })); this is the client option
  // const data = await caller.createAI({text:123}); // this is the server option

  return (  
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
      <Client />  
      </Suspense>
     </HydrationBoundary>
  
  );
}

export default Page;
