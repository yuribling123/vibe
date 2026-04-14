"use client"

import { trpc } from "@/trpc/server";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props{
    projectId: string
}


const ProjectView = ({projectId}: Props) => {
    // fetch project and messages and diplay when ready using suspense query
    const {data:project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({id:projectId})); 
    const {data:messages} = useSuspenseQuery(trpc.messages.getMany.queryOptions({projectId:projectId}));
    return ( 
        <div>
            <h1>Project View</h1>
            {JSON.stringify(project)}
            {JSON.stringify(messages,null,2)}
        </div>
     );
}
 
export default ProjectView;