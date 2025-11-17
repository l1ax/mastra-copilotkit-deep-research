import {
    CopilotRuntime,
    ExperimentalEmptyAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
  } from "@copilotkit/runtime";
  import { NextRequest } from "next/server";
  import { MastraAgent } from "@ag-ui/mastra"
  import { mastra } from "../../../../backend/src/mastra"; // the path to your existing Mastra instance
  
  // 1. Service adapter for multi-agent support (using empty adapter for this example)
  const serviceAdapter = new ExperimentalEmptyAdapter();
  
  // 2. Create the CopilotRuntime instance and utilize the Mastra AG-UI
  //    integration to connect to your existing agent.
  const runtime = new CopilotRuntime({
    // @ts-expect-error - Type compatibility issue: mastra type is inferred as { defaultAgent } but getLocalAgents expects Record<string, Agent>
    agents: MastraAgent.getLocalAgents({ mastra }),
  });
  
  // 3. Build a Next.js API route that handles the CopilotKit runtime requests.
  export const POST = async (req: NextRequest) => {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
    });
  
    return handleRequest(req);
  };