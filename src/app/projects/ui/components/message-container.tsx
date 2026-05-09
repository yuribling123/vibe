import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { use } from "react";
import MessageCard from "./message-card";
import { MessageForm } from "./message-form";
interface Props {
    projectId: string;
}

const MessageContainer = ({ projectId }: Props) => {
    const trpc = useTRPC();
    const { data: messages } = useSuspenseQuery(
        trpc.messages.getMany.queryOptions({ projectId: projectId })
    );
    console.log("messages", messages);


    return (
        // render all user and assistant messages in a scrollable container 
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="pt-2 pr-1">
                    {messages.map((message) => (
                        <MessageCard
                            key={message.id}
                            content={message.content}
                            role={message.role}
                            fragment={message.fragment}
                            createdAt={message.createdAt}
                            isAcitiveFragment={false}
                            onFragmentClick={() => { }}
                            type={message.type}
                        />

                    ))}

                </div>

            </div>
            <div className="relative p-3 pt-1">
                <MessageForm projectId={projectId}/>

            </div>

        </div>
    );
}

export default MessageContainer;