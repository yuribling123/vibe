import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import path from "path";
import { Fragment, useCallback, useMemo, useState } from "react";
import Hint from "../hint";
import { Button } from "@/components/ui/button";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import TreeView from "@/components/ui/tree-view";
import { convertFilestoTreeItems } from "@/lib/utils";
import CodeView from "../code-view";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Filesystem } from "e2b";


type FileCollection = { [path: string]: string };

// return the file type of the file 
function getLanguageFromExtension(filename: string) {
    const extension = filename.split(".").pop()?.toLowerCase();
    return extension || "text"
}

interface FileBreadcrumbProps {
    filePath: string;
}
//use breadcrumb to display the current file path
//bread crumbs means the file path to home
const FileBreadcrumb = ({ filePath }: FileBreadcrumbProps) => {
    const pathSegments = filePath.split("/");
    const maxSegments = 4;

    const segments =
        pathSegments.length <= maxSegments
            ? pathSegments
            : [pathSegments[0], "...", pathSegments[pathSegments.length - 1]];

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;

                    return (
                        // invisible wrapper
                        <Fragment key={index}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="font-medium">
                                        {segment}
                                    </BreadcrumbPage>
                                ) : (
                                    <span className="text-muted-foreground">
                                        {segment}
                                    </span>
                                )}
                            </BreadcrumbItem>

                            {!isLast && <BreadcrumbSeparator />}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};




// the component must receive this type of file object:files = { {"app/page.tsx": "code here"} }
interface Props {
    files: FileCollection
}


const FileExplorer = (
    { files }: Props
) => {
    // store if the file is copied
    const [copied, setCopied] = useState(false);
    // store (the file path) which file is being selected, default to the first file in the list
    const [selectedFile, setSelectedFile] = useState<string | null>(
        () => {
            const fileKeys = Object.keys(files);
            return fileKeys.length > 0 ? fileKeys[0] : null
        }
    )


    // convert the file object into tree structure [ ["foldername", "page.tsx"]]
    const treeData = useMemo( // the converted tree data
        () => {
            return convertFilestoTreeItems(files)
        },
        [files]
    )

    // set the currently selected file (using its filepath)
    const handleFileSelect = useCallback( // remember this function and don't recreate it on every render
        (filePath: string) => {
            if (files[filePath]) {
                setSelectedFile(filePath);
            }
        }, [files]
    )

    // the function to copy file content
    const handleCopy = useCallback(() => {
        if (selectedFile){
            navigator.clipboard.writeText(files[selectedFile])
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
     }
        , [selectedFile, files])



    return (
        <ResizablePanelGroup direction="horizontal">

            {/* render the folders and files tree */}
            <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
                <TreeView data={treeData} onFileSelect={handleFileSelect} />
            </ResizablePanel>

            <ResizableHandle className="hover:bg-primary transition-colors"></ResizableHandle>

            {/* render the code view of the selected file */}
            <ResizablePanel defaultSize={70} minSize={50} className="flex flex-col">
                {selectedFile && files[selectedFile] ? (
                    <div className="h-full w-full flex flex-col">
                        <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center">

                            {/* display the file path of the selected file */}
                            <FileBreadcrumb filePath={selectedFile}></FileBreadcrumb>


                            <Hint text="copy to clickboard" side="bottom" align="start">
                                <Button variant="outline" size="icon" onClick={handleCopy} disabled={false}>
                                    {copied?<CopyCheckIcon/>:<CopyIcon/>}
                                </Button>
                            </Hint>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <CodeView code={files[selectedFile]} lang={getLanguageFromExtension(selectedFile)}></CodeView>
                        </div>

                    </div>

                )

                    : (<div className="flex h-full items-center justify-center text-muted-foreground">select a file to view&apos:s contents</div>)}
            </ResizablePanel>


        </ResizablePanelGroup>


    );
}

export default FileExplorer; 