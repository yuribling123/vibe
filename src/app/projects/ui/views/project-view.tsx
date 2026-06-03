"use client";
// define the layout of left and right panel, left panel is the message container, right panel is the preview of the code execution result

import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { useTRPC } from "@/trpc/client"; // for client-side data fetching
import { useSuspenseQuery } from "@tanstack/react-query";
import MessageContainer from "../components/message-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma/wasm";
import ProjectHeader from "../components/project-header";
import FragmentWeb from "../components/fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CodeView from "../code-view";
import FileExplorer from "../components/file-explorer";

interface Props {
  projectId: string;
}

// get all messages for this project id

const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const trpc = useTRPC();
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  // const { data: project } = useSuspenseQuery(
  //   trpc.projects.getOne.queryOptions({ id: projectId })
  // );



  // resizable panel by dragging
  return (
    <div className="h-screen">



      <ResizablePanelGroup direction="horizontal">
        {/* min--h fixed the size of the div */}
        <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col min-h-0">
          <Suspense fallback={<div>Loading project header...</div>} >
            <ProjectHeader projectId={projectId} />
          </Suspense>

          <Suspense fallback={<div>Loading messages...</div>} >
            <MessageContainer projectId={projectId} activeFragment={activeFragment} setActiveFragment={setActiveFragment} />
          </Suspense>

        </ResizablePanel>

        <ResizableHandle ></ResizableHandle>

        <ResizablePanel defaultSize={65} minSize={50}>
          {/* this means render the active fragment component when it exists */}

          <Tabs className="h-full gap-y-0" defaultValue="preview" value={tabState} onValueChange={(value) => setTabState(value as "preview" | "code")}>
            <div className="flex items-center gap-x-2">

              <TabsList className="h-8 p-0 border rounded-md">

                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon></EyeIcon> <span>demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon></CodeIcon> <span>code</span>
                </TabsTrigger>
              </TabsList>

              <div className="ml-auto flex items-center gap-x-2">
                <Button asChild size="sm" variant="default">
                  <Link href="/pricing"><CrownIcon /> upgrade </Link>
                </Button>
              </div>

            </div>




            <TabsContent value="preview" className="h-full">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>

            <TabsContent value="code" className="min-h-0">
                {/* files will be an object with string as the key as values{"app/page.tsx": "code here"} */}
              {!!activeFragment && (<FileExplorer files = {activeFragment.files as {[path:string]:string}} />)}
            </TabsContent>

          </Tabs>


        </ResizablePanel>

      </ResizablePanelGroup>

    </div>
  );
};

export default ProjectView;