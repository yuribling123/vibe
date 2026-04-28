import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { use } from "react";
import MessageCard from "./message-card";
interface Props {
    projectId: string;
}   

const MessageContainer = ({projectId}:Props) => {
    const trpc = useTRPC();
    const {data:messages} = useSuspenseQuery(
        trpc.messages.getMany.queryOptions({projectId: projectId})
    );
    


    return ( 
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="pt-2 pr-1">
                    { messages.map((message) => (<MessageCard/>  ))}

                </div>

            </div>
            {JSON.stringify(messages)}
        </div>
    );
}
 
export default MessageContainer;