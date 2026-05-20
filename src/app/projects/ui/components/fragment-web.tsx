import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { set } from "zod";
import Hint from "../hint";

interface Props{
    data:Fragment
}

const FragmentWeb = ({data}:Props) => {
    const [copied, setCopied] = useState(false);
    const [fragmentKey,setFragmentKey] = useState(0);
    const onRefresh=()=>{
        setFragmentKey(prev=>prev+1);
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(data.sandboxUrl || "")
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }
    return ( 
        <div className="flex flex-col w-full h-full">

            <div className="p-2 border-b bg-sidebar flex item-center gap-x-2">
                <Hint text="refresh" side="bottom" align="start">
                <Button size="sm" variant="outline" onClick={onRefresh} >
                    <RefreshCcwIcon />
                </Button>
                </Hint>

                <Hint text="click to copy" side="bottom" align="start">
                <Button size="sm" variant="outline" onClick={handleCopy} disabled={copied || !data.sandboxUrl} className="flex-1 justify-start text-start front-normal">
                    <span className="truncate">
                        {data.sandboxUrl}
                    </span>
                </Button>
                </Hint>

                <Hint text="Open in new tab" side="bottom" align="start">
                <Button size="sm" disabled={!data.sandboxUrl} variant="outline" onClick={()=>{if(!data.sandboxUrl) return; window.open(data.sandboxUrl, "_blank");}} >
                    <ExternalLinkIcon/>
                </Button>
                </Hint>

            </div>




            {/* run another website inside */} 
            <iframe key={fragmentKey} className="h-full w-full" sandbox="allow-forms allow-scripts allow-same-origin"
            loading="lazy" src={data.sandboxUrl}
            >
            </iframe>


        </div>
     );
}
 
export default FragmentWeb;