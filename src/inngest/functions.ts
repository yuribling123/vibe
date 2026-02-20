import { success } from "zod";
import { inngest } from "./client";
import { Agent, openai, createAgent } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./utils"

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-test-2");
      return sandbox.sandboxId;
    });

    const summarizer = createAgent({
      name: "summarizer",
      system: "you are an expert Next JS developer. You write readable maintable code, You write simple Next JS and React Snippets.",
      model: openai({ model: "gpt-4o" }),
    });

    const { output } = await summarizer.run(
      `Write the Following Snippet : ${event.data.value}`
    )
    // get url of running sandbox
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
    const sandbox = await getSandbox(sandboxId);

    const host = sandbox.getHost(3000);

    return `https://${host}`;
    });


    // You can use the output in any way you want, such as saving it to a database or returning it in the response
    // For example, you could return the output as part of the response:
    // return { output };

    // If you want to add a delay or perform other steps, you can do so here

    // download step
    // await step.sleep("wait-a-moment", "5s");

    //  
    return { output, sandboxUrl };
  },
); 