import { Card } from "@/components/ui/card";
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import Image from "next/image";


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

interface FragmentCardProps {
    fragment: Fragment;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
}
 
const FragmentCard = ({ fragment, isActiveFragment, onFragmentClick }: FragmentCardProps) => {
    return (
        // click on a fragment card will reset the active fragment and change the class style of it 
        <button className={cn("flex items-start text-start gap-2 border rounded-md transition-colors", isActiveFragment && "bg-primary text-primary-foreground border-primiary hover:bg-secondary ")} onClick={() => onFragmentClick(fragment)}>
            <Code2Icon className="size-4 mt-0.5"/>
             <div className="flex flex-col flex-1">
                <span className="text-sm font-medium line-clamp-1">
                    {fragment.title}
                </span>
                <span className="text-sm" >Preview</span>
             </div> 
             <div className="flex items-center justify-center mt-0.5">
                <ChevronRightIcon className="size-4  "/>
             </div>
        </button>
    )
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
                <Image
                    src="/logo.svg"
                    alt="Vibe Logo"
                    width={18}
                    height={18}
                    className="shrink-0"
                /> 
                <span className="text-sm font-medium">Vibe</span>
                <span className="text-sm text-muted-foreground  transition-opacity group-hover:opacity-100">{format(createdAt, "HH:mm 'on' MMM dd, yyyy")}</span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4">
                <span>{content}</span> 
                {fragement && type ==="RESULT"&&(
                    <FragmentCard fragment={fragement} isActiveFragment={isAcitiveFragment} onFragmentClick={onFragmentClick} />
                )}
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