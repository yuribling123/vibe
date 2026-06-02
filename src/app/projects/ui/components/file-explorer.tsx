import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import path from "path";
import { useCallback, useMemo, useState } from "react";
import Hint from "../hint";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import TreeView from "@/components/ui/tree-view";
import { convertFilestoTreeItems } from "@/lib/utils";
import CodeView from "../code-view";


type FileCollection = { [path: string]: string };

// return the file type of the file 
function getLanguageFromExtension(filename: string) {
    const extension = filename.split(".").pop()?.toLowerCase();
    return extension || "text"
}

// the component must receive this type of file object:files = { {"app/page.tsx": "code here"} }
interface Props {
    files: FileCollection
}


const FileExplorer = (
    { files }: Props
) => {
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
                            <Hint text="copy to clickboard" side="bottom" align="start">
                                <Button variant="outline" size="icon" onClick={() => { }} disabled={false}>
                                    <CopyIcon />
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