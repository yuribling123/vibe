/**
 * AI sandbox workflow:
 * 1. Create a cloud sandbox (safe remote Next.js environment)
 * 2. Give GPT tools to read/write files & run terminal commands
 * 3. GPT generates code and runs the app inside the sandbox
 * 4. Return the AI output + the live preview URL (port 3000)
 *
 * Triggered by the Inngest event: " 
 */

// let the ai agent code inside the sandbox 
import { inngest } from "./client";
import { Agent, openai, createAgent, createTool, createNetwork, Tool, createState } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils"
import { z } from "zod";
import { PROMPT } from "@/prompt";
import prisma from "@/lib/db";
import { is } from "date-fns/locale";  
import { Message } from "@inngest/agent-kit"
interface PreviousMessage {
  type: "text";
  role: "ASSISTANT" | "USER";
  content: string;
}
interface AgentState {
  summary: string;
  files: { [path: string]: string }
}

export const codeAgentFunction = inngest.createFunction(
  {
    id: "code-agent",
    triggers: { event: "code-agent/run" },
  },
  async ({ event, step }) => {
    try {

      // Get sandbox id from e2b
      const sandboxId = await step.run("get-sandbox-id", async () => {
        const sandbox = await Sandbox.create("vibe-nextjs-test-2");
        return sandbox.sandboxId;
      });


      // grab previous memorized messages
      const previousMessages = await step.run("get-previous-messages", async () => {  


        const formattedMessages : Message[]= []

        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,

          });
        }

        return formattedMessages;       

      })

      const state = createState<AgentState>({
        summary: "",
        files: {}
      },
      {messages: previousMessages}

      )

   

      // Create an agent with our written custmoized prompt, model, and tool to write in remote sandbox
      const codeAgent = createAgent<AgentState>({

        name: "code-agent",
        description: "an expert coding",
        system: PROMPT,
        model: openai({
          model: "gpt-5.2",
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
            handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
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

      const network = createNetwork<AgentState>(
        {
          defaultState:state,
          name: "coding-agent-network",
          agents: [codeAgent],
          maxIter: 2,
          router: async ({ network }) => { const summary = network.state.data.summary; if (summary) { return } return codeAgent }
        }
      )


      // Run the code agent with the input prompt and get the output
      const result = await network.run(event.data.value,{state});

      const fragmentTitleGenerator = createAgent(
        {
          name:"fragment-title-generator",
          description: "a fragment title generator",
          system: PROMPT,
          model:openai({model:"gpt-4o"}),
        }
      )


      const responseGenerator = createAgent(
        {
          name:"response-generator",
          description: "a response generator",
          system: PROMPT,
          model:openai({model:"gpt-4o"}),
        }
      )

      const {output:fragmentTitleOutput} = await fragmentTitleGenerator.run(result.state.data.summary)
      const {output:responseOutput} = await responseGenerator.run(result.state.data.summary)

      // parse the responses
      const generateFragmentTitle = () =>{
        if (fragmentTitleOutput[0].type !=="text"){
          return "Fragment"
        }
        // covert the answer into right format
        if (Array.isArray(fragmentTitleOutput[0].content)){
          return fragmentTitleOutput[0].content.map(txt=>txt).join("")
        }
        else{
          return fragmentTitleOutput[0].content 
        }
      }
      const generateResponse = () =>{
        if (responseOutput[0].type !=="text"){
          return "Response "
        }
        // covert the answer into right format
        if (Array.isArray(responseOutput[0].content)){
          return responseOutput[0].content.map(txt=>txt).join("")
        }
        else{
          return responseOutput[0].content 
        }
      }







      const isError = !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;


      // Get the sandbox URL 
      const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxId);
        //get the port that have our app running
        const host = sandbox.getHost(3000);

        return `https://${host}`;
      });
      // save sandbox url and the result to the database
      await step.run("save-result", async () => {
        if (isError) {
          return await prisma.message.create({
            data: {
              projectId: event.data.projectId,
              content: "Error occurred while processing the request.",
              role: "ASSISTANT",
              type: "ERROR"
            }
          });
        }
        // Here you can save the result to a database or do something else with it
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: generateResponse(),
            role: "ASSISTANT",
            type: "RESULT",
            fragment: {
              create: {
                sandboxUrl: sandboxUrl,
                title: generateFragmentTitle(),
                files: result.state.data.files
              }
            }

          },

        })
      });

      return { result, sandboxUrl };
    }
    catch (error) {

      await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: "Sorry, something went wrong. Please try again.",
          role: "ASSISTANT",
          type: "ERROR",
        },
      });

      // Re-throw so Inngest still marks the run as Failed
      throw error;


    }
  },
); 