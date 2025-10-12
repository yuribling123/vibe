  "useclient";

import { useSuspenseQueries } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";    

   const Client = () => {
    const trpc = useTRPC();
    // const {data} = useSuspenseQueries(trpc.createAI.queryOptions({text:""}) )
    
   }
    
   export default Client;  