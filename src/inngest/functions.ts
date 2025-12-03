import { success } from "zod";
import { inngest } from "./client";
import {Agent,openai,createAgent} from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {

    const summarizer = createAgent({
      name: "summarizer",
      system:"you are an expert summari zer. You summarize in two words",
      model: openai({model:"gpt-4o"}),
    });
    
    const {output} =  await summarizer.run(
      `Summarize the following text : ${event.data.value}`
    )
  
    console.log(output)


    // download step
    // await step.sleep("wait-a-moment", "5s");
 
    //  
    return { output};
  },
); 