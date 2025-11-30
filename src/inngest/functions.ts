import { inngest } from "./client";
import {Agent,openai,createAgent} from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    const summarizer = createAgent({
      name: "summarizer",
      system:"you are an expert summarizer. You summarize in two words",
      model: openai({model:"gpt-4o"}),
    });




    // download step
    await step.sleep("wait-a-moment", "5s");
 
    //  
    return { message: `Hello ${event.data.value}!` };
  },
); 