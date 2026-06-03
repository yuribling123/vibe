import { type TreeItem } from "@/type"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarProvider, SidebarRail } from "./sidebar";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "./collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";

interface props {
    data: TreeItem[]; // the tree data to be rendered, in the format of [ ["foldername", "page.tsx"]]
    value?:string|null; // the currently selected file path
    onFileSelect?:(value:string)=>void; // callback function when a file is selected, passing the file path as an argument
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
                                {/* recursive rending of all folders and files trees */}
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
    item:TreeItem; // the current tree item to be rendered, can be a folder or a file ["foldername", "page.tsx"] or "page.tsx"
    selectedValue?:string|null; // the currently selected file path
    onFileSelect?:(value:string)=>void; // callback function when a file is selected, passing the file path as an argument    
    parentPath:string  // the file path of the parent folder, used to construct the full file path for the current item
}

const Tree = ({ item, selectedValue, onFileSelect, parentPath }: TreeProps) => {   

    const [name,...items] = Array.isArray(item) ? item : [item]  
    //name = "app" items = ["page.tsx","layout.tsx"] for item = ["app", "page.tsx", "layout.tsx"]
    //name = "page.tsx" items = [] for "page.tsx" 
    
    //construct the full file path for the current item
    const currentPath = parentPath ? `${parentPath}/${name}` : name;
 
    // the tree item is a file
    if (!items.length){
        const isSelected = currentPath === selectedValue;

        return (     
            // click on the file will set the current selected file
            <SidebarMenuButton isActive={isSelected} onClick={()=>onFileSelect?.(currentPath)}>
                <FileIcon></FileIcon> 
                {name} 
            </SidebarMenuButton>

           )
    }
   
    // the tree item is a folder, render it as a collapsible item with its children
    return(
        <SidebarMenuItem>
            <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" defaultOpen>
                {/* render folder name */}
                <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                    <ChevronRightIcon className="transition-transform" />
                    <FolderIcon></FolderIcon>
                    <span className="truncate">{name}</span>
                </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    {/* render children items recursively */}
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