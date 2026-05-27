import { type TreeItem } from "@/type"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarProvider, SidebarRail } from "./sidebar";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "./collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
interface props {
    data: TreeItem[];
    value?:string|null;
    onFileSelect?:(value:string)=>void;
}



const TreeView = (
    {data,onFileSelect,value}:props

) => {
    return ( 
        <SidebarProvider>

            <Sidebar collapsible="none" className="w-full">

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>

                            <SidebarMenu>
                                {data.map((item,index)=>(
                                    <Tree key={index} item={item} onFileSelect={onFileSelect} selectedValue={value || null} parentPath="" />
                                ))}
                                
                            </SidebarMenu>


                            
                        </SidebarGroupContent>

                        
                    </SidebarGroup>




                </SidebarContent>
                <SidebarRail></SidebarRail>
                
            </Sidebar>



            
        </SidebarProvider>

        

     );
}
 
export default TreeView;



interface TreeProps{

    item:TreeItem;
    selectedValue?:string|null;
    onFileSelect?:(value:string)=>void;    
    parentPath:string;
     
}

const Tree = ({ item, selectedValue, onFileSelect, parentPath }: TreeProps) => {   
    const [name,...items] = Array.isArray(item) ? item : [item]  
    
    const currentPath = parentPath ? `${parentPath}/${name}` : name;

    if (!items.length){
        const isSelected = currentPath === selectedValue;

        return (     
            <SidebarMenuButton isActive={isSelected} onClick={()=>onFileSelect?.(currentPath)}>
                <FileIcon></FileIcon> 
                {name} 
 
            </SidebarMenuButton>

           )
    }
    // is a folder 

    return(
        <SidebarMenuItem>
            <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" defaultOpen>

                <CollapsibleTrigger asChild>
  
                <SidebarMenuButton>
                    <ChevronRightIcon className="transition-transform" />
                    <FolderIcon></FolderIcon>
                    <span className="truncate">{name}</span>
                </SidebarMenuButton>
                
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>

                        {items.map((subItem,index)=>(
                            <Tree key={index} item={subItem} selectedValue={selectedValue} onFileSelect={onFileSelect} parentPath={currentPath} />
                        ))}


                    </SidebarMenuSub>
                
                </CollapsibleContent>

            </Collapsible>

            
        </SidebarMenuItem>
    )

}