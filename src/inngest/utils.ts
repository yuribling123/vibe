import {Sandbox} from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";
 
export async function getSandbox(sandboxId: string){
    const sandbox = await Sandbox.connect(sandboxId);
    return sandbox;
}    
// Gets the LAST assistant message from the agent result and returns its text content as a single string.
export function lastAssistantTextMessageContent(result : AgentResult){
    const lastAssistantTestMessageIndex = result.output.findLastIndex(
        (message)=> message.role === "assistant"
    )
    const message = result.output[lastAssistantTestMessageIndex] as | TextMessage | undefined;
    return message?.content ? typeof message.content == "string"  ? message.content : message.content.map((c)=> c.text).join("")
    : undefined
}