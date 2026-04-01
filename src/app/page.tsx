"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { use, useState } from "react";
import { toast } from "sonner";

const Page = () => {

  // create open ai key
  const [value,setValue] = useState("")
  const trpc = useTRPC();
  const createProject = useMutation({
    ...trpc.projects.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message); 
    },  
    onSuccess: () => {
      toast.success("Message created!"); 
    } 
  });
  // rename the fetched data to messages
  const {data:messages} = useQuery(trpc.messages.getMany.queryOptions());
 

  
  return (  
   <div className="p-4 max-w-7xl mx-auto" >
    <Input value = {value} onChange={(e)=> setValue(e.target.value)}></Input>
     <Button disabled={createProject.isPending}  onClick={()=> createProject.mutate({value:value})}>
      Submir
     </Button>
     {JSON.stringify(messages,null,2)}
   </div>
  
  );
}

export default Page;
