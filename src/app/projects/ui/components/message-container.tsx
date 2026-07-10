import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { use, useEffect } from "react";
import MessageCard from "./message-card";
import { MessageForm } from "./message-form";
import { useRef } from "react";
import { Fragment } from "@/generated/prisma/wasm";
import { MessageLoading } from "./message-loading";
interface Props {
    projectId: string;
    activeFragment: Fragment | null;
    setActiveFragment: (fragment: Fragment | null) => void;
}

const MessageContainer = ({ projectId, activeFragment, setActiveFragment }: Props) => {
    // ref remembers the data without causing re-render
    const bottomRef = useRef<HTMLDivElement>(null);// locate the last element, auto scroll to bottom
    const lastAssistantMessageIdRef = useRef<string | null>(null); // store the last assistant message id
    const trpc = useTRPC();
    const { data: messages } = useSuspenseQuery(
        trpc.messages.getMany.queryOptions({ projectId: projectId }, {refetchInterval:2000}) // "real time" updates (polling)
    
    );
    console.log("messages", messages);

    // set the last assistant message as active fragment
    useEffect(() => {
        const lastAssistantMessage = messages.findLast(
            // check all message from end, find last assistant message 
            (message) => message.role === "ASSISTANT"
        )
        if (lastAssistantMessage?.fragment && lastAssistantMessage.id !== lastAssistantMessageIdRef.current) {
            setActiveFragment(lastAssistantMessage.fragment); // set active fragment to the last assistant message's fragment
            lastAssistantMessageIdRef.current = lastAssistantMessage.id; // update the ref to the last assistant message id
        }
    }, [messages,setActiveFragment]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" }); // scroll to the html element
    }, [messages.length])

    const lastMessage = messages[messages.length - 1];
    const isLastMessageUser = lastMessage?.role === "USER";


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
                            isAcitiveFragment={activeFragment?.id === message.fragment?.id}
                            onFragmentClick={() => setActiveFragment(message.fragment)}
                            type={message.type}
                        />
                    ))}
                    {isLastMessageUser && <MessageLoading/>}
                    <div ref={bottomRef} />
                </div>
            </div>
            <div className="relative p-3 pt-1">
                {/* white shadow the clipping text in scrolling window */}
                <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none"></div>
                {/* the message input component */}
                <MessageForm projectId={projectId} />

            </div>

        </div>
    );
}

export default MessageContainer;