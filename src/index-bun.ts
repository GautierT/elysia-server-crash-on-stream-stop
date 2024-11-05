import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export const anthropic = createAnthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

Bun.serve({
	port: 3000,
	fetch: async (req) => {
		console.log("Start POST /", req.signal);
		const res = await streamText({
			model: anthropic("claude-3-5-sonnet-20240620", { cacheControl: true }),
			temperature: 0,
			messages: [
				{
					role: "user",
					content: "write a very long poem (more than 1000 words) about life",
				},
			],
			abortSignal: req.signal,
			onChunk(event) {
				console.log("onChunk", event);
			},
			onFinish(event) {
				console.log("onFinish", event);
			},
			//abortSignal: request.signal,
		});

		console.log("Return response");

		return res.toDataStreamResponse();

		//return new Response("Hello World from bun");
	},
});
