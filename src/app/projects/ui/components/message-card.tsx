interface MessageCardProps {
    content: string;
    role: string;
    createdAt: Date;
    isAcitiveFragment: boolean;
    onFragmentClick: () => void;
    type: string;
}

const MessageCard = () => {
    return ( 
        <>
        message card
        </>
     );
}
 
export default MessageCard;