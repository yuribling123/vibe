"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { use, useState } from "react";
import { toast } from "sonner";

const Page = () => {

  //   create open ai key
  const [value,setValue] = useState("")
    

  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess() {
      toast.success("Background job invoked!");
    } 
  }));


 
  return (  
   <div className="p-4 max-w-7xl mx-auto" >
    <Input></Input>
     <Button disabled={invoke.isPending}  onClick={()=> invoke.mutate({text:"John "} )}>
      Invoke Background Job
     </Button>

   </div>
  
  );
}

export default Page;
