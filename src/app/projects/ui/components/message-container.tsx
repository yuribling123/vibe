import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { use, useEffect } from "react";
import MessageCard from "./message-card";
import { MessageForm } from "./message-form";
import { useRef } from "react";
interface Props {
    projectId: string;
}

const MessageContainer = ({ projectId }: Props) => {

    const bottomRef = useRef<HTMLDivElement>(null);// locate the last element, auto scroll to bottom
    const trpc = useTRPC();
    const { data: messages } = useSuspenseQuery(
        trpc.messages.getMany.queryOptions({ projectId: projectId })
    );
    console.log("messages", messages);

    useEffect(() => {
        const lastAssistantMessage = messages.findLast(
            // check all message from end, find last assistant message 
            (message) => message.role === "ASSISTANT"
        )
        if (lastAssistantMessage) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" }); // scroll to the html element
    }, [messages.length])


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
                    <div ref={bottomRef} />

                </div>

            </div>
            <div className="relative p-3 pt-1">
                {/* white shadow the clipping text in scrolling window */}
                <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none"></div>
                <MessageForm projectId={projectId} />

            </div>

        </div>
    );
}

export default MessageContainer;