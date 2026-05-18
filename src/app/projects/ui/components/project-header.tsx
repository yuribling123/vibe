import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

import {ChevronDownIcon, ChevronLeftIcon, SunMoonIcon} from "lucide-react"; 
import { useTRPC } from "@/trpc/client";
import { Dropdown } from "react-day-picker";
import { DropdownMenu, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuSubContent } from "@radix-ui/react-dropdown-menu";
import { set } from "zod";

// suspense query is suspend the component until the data is ready, then render the component with the data
interface Props {
    projectId: string;
}

const ProjectHeader = ({ projectId }: Props) => {
    const { theme,setTheme} = useTheme();
    const trpc = useTRPC();
    const {data: project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({id:projectId})    );
    return ( 
        <header className="p-2 flex justify-between items-center border-b">
            
         
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant = "ghost" size="sm" className="focus-visible:ring-0 hover:opacity-75 transition-opacity pl-2!">
                        <Image src="/logo.svg" alt="vibe" width={18} height={18}  />
                        <span className="text-sm font-medium"> {project.name}</span>
                        <ChevronDownIcon/>

                    </Button>
                    
                </DropdownMenuTrigger>

                <DropdownMenuContent side="bottom">
                    <DropdownMenuItem asChild>
                        <Link href="/">
                            <span>go to dashboard</span>
                        </Link>
                        
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />


                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="gap-2">
                            <SunMoonIcon className="size-4 text-muted-foreground"></SunMoonIcon>
                            <span>appearance</span>
                        </DropdownMenuSubTrigger>

                        <DropdownMenuPortal>

                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value="theme" onValueChange={setTheme}>

                                    <DropdownMenuRadioItem value="light">
                                        <span>light</span>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark">
                                        <span>dark</span>
                                    </DropdownMenuRadioItem>
                                    
                                </DropdownMenuRadioGroup>


                            </DropdownMenuSubContent>

                            
                        </DropdownMenuPortal>
                        
                    </DropdownMenuSub>
                    

                </DropdownMenuContent>
                
            </DropdownMenu>

             
        </header>
     );
}
 
export default ProjectHeader;