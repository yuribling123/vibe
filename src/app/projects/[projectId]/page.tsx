// the page will receive a param, which after wait becomes the projectId
interface Props {
    params: Promise<{ projectId: string}>
}

const Page = async ({ params }: Props) => {
    const { projectId } = await params;
    return (
        <div>
            <h1>Project Page</h1>
            <p>Project ID: {projectId}</p>
        </div>
    );
}

export default Page;