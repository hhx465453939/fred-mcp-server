export type McpTextResponse = {
  content: Array<{
    type: "text";
    text: string;
  }>;
};

export function toMcpTextResponse(data: unknown): McpTextResponse {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

