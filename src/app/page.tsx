import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Client from "./client";

const Page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.hello.queryOptions({ text: "Antonio PREFETCH" }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Client />  // Cannot find name 'Client'.
    </HydrationBoundary>
  );
}

export default Page;
