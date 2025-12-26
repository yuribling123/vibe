import { success } from "zod";
import { inngest } from "./client";
import {Agent,openai,createAgent} from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {

    const summarizer = createAgent({
      name: "summarizer",
      system:"you are an expert Next JS developer. You write readable maintable code, You write simple Next JS and React Snippets.",
      model: openai({model:"gpt-4o"}),
    });
    
    const {output} =  await summarizer.run(
      `Write the Following Snippet : ${event.data.value}`
    )
  
    console.log(output)


    // download step
    // await step.sleep("wait-a-moment", "5s");
 
    //  
    return { output};
  },
); 