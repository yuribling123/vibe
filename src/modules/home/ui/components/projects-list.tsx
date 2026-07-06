import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/nextjs";



const ProjectList = () => {
    const {user} = useUser()

    const trpc = useTRPC()
    // fetch all projects data and save to constant project
    const { data: projects } = useQuery(trpc.projects.getMany.queryOptions())

    if (!user) {    return null;  } // if user is not logged in, return null

    return (
        <div className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4">

            <h2> {user?.firstName} &apos;s Projects</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {
                    projects?.length === 0 && (<div className="col-span-full text-center">No Projects Found</div>)
                }
                {projects?.map((project) => (
                    <Button key={project.id} variant="outline" className="font-normal h-auto justify-start p-4 text-start w-full" asChild>
                        <Link href={`/projects/${project.id}`}>
                        <div className="flex items-center gap-x-4">
                            <Image src="/logo.svg" alt="logo" width={32} height={32} className="object-contain" />
                            <div className="flex flex-col">

                                <h3 className="truncate font-medium"> {project.name} </h3>

                                <p className="text-sm text-muted-foreground">{formatDistanceToNow(project.updatedAt,{addSuffix:true})}</p>
                            </div>
                            

                        </div>
                        
                        </Link>
                    </Button>
                ))}
            </div>


        </div>


    );
}

export default ProjectList;