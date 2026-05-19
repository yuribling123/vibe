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

interface Props {
  projectId: string;
}

// get all messages for this project id

const ProjectView = ({ projectId }: Props) => {
  const [activeFragment,setActiveFragment] = useState<Fragment| null>(null);
  const trpc = useTRPC();

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
    
      {!!activeFragment && <FragmentWeb data={activeFragment} />}
      </ResizablePanel>

      </ResizablePanelGroup>

    </div>
  );
};

export default ProjectView;