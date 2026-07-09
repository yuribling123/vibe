// 1. HydrationBoundary: Passes the data fetched on the server to the client, so it doesn't have to fetch it again.'
// 2. ErrorBoundary: If something inside crashes, show a fallback instead of breaking the whole page.
// 3. Suspense: While waiting for data, show a loading UI.
import { getQueryClient,trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ProjectView from "../ui/views/project-view";
import {ErrorBoundary} from "react-error-boundary";
import { Suspense } from "react";

// the page will receive a param, which after wait becomes the projectId
interface Props {
    params: Promise<{ projectId: string}>
}

const Page = async ({ params }: Props) => {
    const { projectId } = await params;
    // prefetch messages for this project
    const queryClient = getQueryClient();
    // void = we don't care about the return value
    // get all messages under this project
    void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({ projectId }));
    void queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({ id:projectId }));

    return (
        // use the hydration boundary to pass the prefetched data to the client
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary fallback={<p>Error!</p>}>
            <Suspense fallback={<p>Loading Projects</p>}>
            <ProjectView projectId={projectId} />
            </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
}

export default Page; 