import { getQueryClient,trpc } from "@/trpc/server";

// the page will receive a param, which after wait becomes the projectId
interface Props {
    params: Promise<{ projectId: string}>
}

const Page = async ({ params }: Props) => {
    const { projectId } = await params;
    // prefetch messages for this project
    const queryClient = getQueryClient();
    // void = we don't care about the return value
    void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({ projectId }));

    return (
        <div>
            <h1>Project Page</h1>
            <p>Project ID: {projectId}</p>
        </div>
    );
}

export default Page; 