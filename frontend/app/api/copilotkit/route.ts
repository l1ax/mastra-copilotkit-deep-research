import {
    CopilotRuntime,
    ExperimentalEmptyAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
  } from "@copilotkit/runtime";
  import { NextRequest } from "next/server";
  import { MastraAgent } from "@ag-ui/mastra";
  import { MastraClient } from "@mastra/client-js";
  
  // 1. Service adapter for multi-agent support (using empty adapter for this example)
  const serviceAdapter = new ExperimentalEmptyAdapter();
  
  // 2. Create MastraClient instance to connect to backend Mastra server via HTTP
  //    Default to http://localhost:3000, can be overridden via MASTRA_SERVER_URL env variable
  const mastraClient = new MastraClient({
    baseUrl: process.env.MASTRA_SERVER_URL || "http://localhost:4111",
  });
  
  // 3. Build a Next.js API route that handles the CopilotKit runtime requests.
  export const POST = async (req: NextRequest) => {
    // Get remote agents from Mastra server via HTTP
    const agents = await MastraAgent.getRemoteAgents({ 
      mastraClient,
    });
  
    // Create the CopilotRuntime instance with remote agents
    const runtime = new CopilotRuntime({
      agents,
    });
  
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
    });
  
    return handleRequest(req);
  };