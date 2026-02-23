/**
 * AI sandbox workflow:
 * 1. Create a cloud sandbox (safe remote Next.js environment)
 * 2. Give GPT tools to read/write files & run terminal commands
 * 3. GPT generates code and runs the app inside the sandbox
 * 4. Return the AI output + the live preview URL (port 3000)
 *
 * Triggered by the Inngest event: " 
 */
import { inngest } from "./client";
import { Agent, openai, createAgent, createTool } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils"
import { z } from "zod";
import { PROMPT } from "@/prompt";

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
      description: "an expert coding",
      system: PROMPT,
      model: openai({
        model: "gpt-4.1 ",
        defaultParameters: {
          temperature: 0.1,


        }
      }),
      // terminal tool, read file tool, write file tool 
      tools: [

        // Terminal tool to run commands in the sandbox
        createTool({
          name: "Terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({ command: z.string() }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  }
                });
                return result.stdout;
              }
              catch (e) {
                console.error(`command failed: ${e} \n stdout: ${buffers.stdout} \n stderr: ${buffers.stderr}`);
              }
            })
          }

        }),

        // Create or update file tool to create or update files in the sandbox
        createTool({
          name: "createOrUpdateFile",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(z.object({ path: z.string(), content: z.string() })),
          }),
          handler: async ({ files }, { step, network }) => {
            const newFiles = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
                return updatedFiles;

              } catch (e) {
                return "error:" + e;
              }
            });
            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),
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


      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText = lastAssistantTextMessageContent(result)
          if (lastAssistantMessageText?.includes("<task_summary>") && network) {
            network.state.data.summary = lastAssistantMessageText
          }
          return result
        }
      }

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