import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import {format} from "date-fns";

interface MessageCardProps {
    content: string;
    role: MessageRole;
    fragment: Fragment | null;
    createdAt: Date;
    isAcitiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
}

interface AssistantMessageProps {
    content: string;
    fragement: Fragment | null;
    createdAt: Date;
    isAcitiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
}

const AssistantMessage = ({
    content,
    fragement,
    createdAt,
    isAcitiveFragment,
    onFragmentClick,
    type
}: AssistantMessageProps) => {
    return (
        <div className={cn("flex items-center",type==="ERROR"&&"text-red-700" )}>
           <div className="flex items-center gap-2 pl-2 mb-2">
            <span className="text-sm font-medium">Vibe</span>
            <span className="text-sm text-muted-foreground opacity-0 transition-opacity">{format(createdAt, "hh:mm:ss a")}</span>
           </div>
        </div>
    )
}

const MessageCard = (
    { content,
        role,
        fragment,
        createdAt,
        isAcitiveFragment,
        onFragmentClick,
        type }: MessageCardProps
) => {
    if (role === "ASSISTANT") {
        return (
            <AssistantMessage
                content={content}
                fragement={fragment}
                createdAt={createdAt}
                isAcitiveFragment={isAcitiveFragment}
                onFragmentClick={onFragmentClick}
                type={type}
            />
        )
    }
    return (
        <p>{type}</p>
    );
}

export default MessageCard;