import { Card } from "@/components/ui/card";
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MessageCardProps {
    content: string;
    role: MessageRole;
    fragment: Fragment | null;
    createdAt: Date;
    isAcitiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
}

interface UserMessageProps {
    content: string;
}

interface AssistantMessageProps {
    content: string;
    fragement: Fragment | null;
    createdAt: Date;
    isAcitiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
}

const UserMessage = ({content}: UserMessageProps)=>{
    return(
        <div className="flex justify-end pb-4 pr-2 pl-10">
                <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words ">
                    {content}
                </Card>
        </div>
    )


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
        <div className={cn("flex flex-col group px-2 pb-4", type === "ERROR" && "text-red-700")}>
            <div className="flex items-center gap-2 pl-2 mb-2">
                <span className="text-sm font-medium">Vibe</span>
                <span className="text-sm text-muted-foreground  transition-opacity group-hover:opacity-100">{format(createdAt, "HH:mm 'on' MMM dd, yyyy")}</span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4">
                <span>{content}</span>
                <span>{fragement?.sandboxUrl}</span>
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
        <UserMessage content={content} />
    );
}

export default MessageCard;