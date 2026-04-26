"use client";

import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useTRPC } from "@/trpc/client"; // for client-side data fetching
import { useSuspenseQuery } from "@tanstack/react-query";

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
      <h1>Project View</h1>
      </ResizablePanel>
      {JSON.stringify(project)}
      {JSON.stringify(messages, null, 2)}
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;