import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import path from "path";
import { useState } from "react";
import Hint from "../hint";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import CodeView from "../code-view";


type FileCollection = { [path: string]: string };

function getLanguageFromExtension(filename: string) {
    const extension = filename.split(".").pop()?.toLowerCase();
    return extension || "text"
}

interface Props {
    files: FileCollection

}


const FileExplorer = (
    { files }: Props
) => {
    // select the first file by default
    const [selectedFile, setSelectedFile] = useState<string | null>(() => { const fileKeys = Object.keys(files); return fileKeys.length > 0 ? fileKeys[0] : null; });
    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
                <p>Tree</p>
            </ResizablePanel>

            <ResizableHandle className="hover:bg-primary transition-colors"></ResizableHandle>

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