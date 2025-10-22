
import { useTRPC } from "@/trpc/client";
import { caller } from "@/trpc/server";
import { useQuery } from "@tanstack/react-query";
import { text } from "stream/consumers";

const Page = async () => {
  // const queryClient = getQueryClient();
  // void queryClient.prefetchQuery(trpc.createAI.queryOptions({ text: 123 }));
  // const trpc = useTRPC();
  // const {data} = useQuery(trpc.createAI.queryOptions({ text: 123 })); this is the client option
  const data = await caller.createAI({text:123}); // this is the server option

  return (  
    // <HydrationBoundary state={dehydrate(queryClient)}>
    //   <Client />  // Cannot find name 'Client'.
    // </HydrationBoundary>
    <div>{JSON.stringify(data)}</div>
  );
}

export default Page;
