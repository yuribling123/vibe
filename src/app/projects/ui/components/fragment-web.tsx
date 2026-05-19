import { Fragment } from "@/generated/prisma";

interface Props{
    data:Fragment
}

const FragmentWeb = ({data}:Props) => {
    return ( 
        <div className="flex flex-col w-full h-full">

            {/* run another website inside */}
            <iframe className="h-full w-full" sandbox="allow-forms allow-scripts allow-same-origin"
            loading="lazy" src={data.sandboxUrl}
            >


            </iframe>


        </div>
     );
}
 
export default FragmentWeb;