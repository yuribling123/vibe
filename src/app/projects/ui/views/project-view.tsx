"use client";

import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { useTRPC } from "@/trpc/client"; // for client-side data fetching
import { useSuspenseQuery } from "@tanstack/react-query";
import MessageContainer from "../components/message-container";

interface Props {
  projectId: string;
}

// get all messages for this project id

const ProjectView = ({ projectId }: Props) => {
  const trpc = useTRPC();

  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  // resizable panel by dragging
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">

      <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col min-h-0">

      <MessageContainer />
      </ResizablePanel>

      <ResizableHandle withHandle ></ResizableHandle>

      <ResizablePanel defaultSize={65} minSize={50}>
    
      Todo: preview
      </ResizablePanel>

      </ResizablePanelGroup>

    </div>
  );
};

export default ProjectView;