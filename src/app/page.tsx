"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const Page =  () => {
  // const queryClient = getQueryClient();
  // void queryClient.prefetchQuery(trpc.createAI.queryOptions({ text: 123 }));
  const trpc = useTRPC();
  const {data} = useQuery(trpc.createAI.queryOptions({ text: 123 }));

  return (  
    // <HydrationBoundary state={dehydrate(queryClient)}>
    //   <Client />  // Cannot find name 'Client'.
    // </HydrationBoundary>
    <div>{JSON.stringify(data)}</div>
  );
}

export default Page;
