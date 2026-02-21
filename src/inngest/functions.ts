import { success } from "zod";
import { inngest } from "./client";
import { Agent, openai, createAgent, createTool } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./utils"
import { de } from "date-fns/locale";
import { z } from "zod";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    // Get sandbox id from e2b
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-test-2");
      return sandbox.sandboxId;
    });

    // Create an agent with a system prompt and a model
    const codeAgent = createAgent({

      name: "code-agent",
      system: "you are an expert Next JS developer. You write readable maintable code, You write simple Next JS and React Snippets.",
      model: openai({ model: "gpt-4o" }),
      // terminal tool, read file tool, write file tool 
      tools: [
        // Terminal tool to run commands in the sandbox
        createTool({ name: "Terminal", description: "Use the terminal to run commands", parameters: z.object({ command: z.string() }), handler: async (input) => { return `Executed: ${input.command}` } }),
        // Read file tool to read files from the sandbox
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content: content });
                }
                return JSON.stringify(contents);
              }
              catch (e) {
                return "error: " + e;
              }
            });
          },
        })


      ]

    });


    // Run the code agent with the input prompt and get the output
    const { output } = await codeAgent.run(
      `Write the Following Snippet : ${event.data.value}`
    )


    // Get the sandbox URL 
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);

      const host = sandbox.getHost(3000);

      return `https://${host}`;
    });

    return { output, sandboxUrl };
  },
); 