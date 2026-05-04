import { Fragment, MessageRole, MessageType } from "@/generated/prisma";

interface MessageCardProps {
    content: string;
    role: MessageRole;
    fragment: Fragment | null;
    createdAt: Date;
    isAcitiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
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
            <p>Assistant</p>
        )
    }
    return (
        <p>User</p>
    );
}

export default MessageCard;