import { success } from "zod";
import { inngest } from "./client";
import {Agent,openai,createAgent} from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    console.log(process.env.OPENAI_API_KEY);

    const summarizer = createAgent({
      name: "summarizer",
      system:"you are an expert Next JS developer. You write readable maintable code, You write simple Next JS and React Snippets.",
      model: openai({model:"gpt-4o"}),
    });
    
    const {output} =  await summarizer.run(
      `Write the Following Snippet : ${event.data.value}`
    )
    console.log("output", output); // print to server console

    // You can use the output in any way you want, such as saving it to a database or returning it in the response
    // For example, you could return the output as part of the response:
    // return { output };

    // If you want to add a delay or perform other steps, you can do so here
  
    


    // download step
    // await step.sleep("wait-a-moment", "5s");
 
    //  
    return { output};
  },
); 