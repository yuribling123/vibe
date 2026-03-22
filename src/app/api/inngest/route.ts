import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { codeAgent } from "@/inngest/functions";

// this file is the entry point for all inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    codeAgent,
  ],
});