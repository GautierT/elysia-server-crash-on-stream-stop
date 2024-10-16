import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export const anthropic = createAnthropic({
	apiKey: "YOUR_API_KEY",
});

Bun.serve({
	port: 3000,
	fetch: async (req) => {
		console.log("Start POST /");
		const res = await streamText({
			model: anthropic("claude-3-5-sonnet-20240620", { cacheControl: true }),
			temperature: 0,
			messages: [
				{
					role: "user",
					content: "write a very long poem (more than 1000 words) about life",
				},
			],
			//abortSignal: request.signal,
		});

		console.log("Return response");

		return res.toDataStreamResponse();

		//return new Response("Hello World from bun");
	},
});
