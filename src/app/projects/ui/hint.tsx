import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger} from "@/components/ui/tooltip";




interface Props{
    text:string;
    children:React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
}

const Hint = ({text, children, side, align}:Props) => {
    return ( 
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    {text}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>


     );
}
 
export default Hint;