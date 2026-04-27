import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { use } from "react";
interface Props {
    projectId: string;
}   

const MessageContainer = ({projectId}:Props) => {
    const trpc = useTRPC();
    const {data:messages} = useSuspenseQuery(
        trpc.messages.getMany.queryOptions({projectId: projectId})
    );
    


    return ( 
        <div>
            {JSON.stringify(messages)}
        </div>
    );
}
 
export default MessageContainer;