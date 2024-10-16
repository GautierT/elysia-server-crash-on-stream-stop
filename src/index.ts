import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { Elysia } from "elysia";
import { Hono } from "hono";

export const anthropic = createAnthropic({
	apiKey: "YOUR_API_KEY",
});

/* const hono = new Hono().post("/", async (c) => {
	console.dir(c.req, { depth: Number.MAX_SAFE_INTEGER });

	console.log("method : ", c.req.method);

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

	return res.toDataStreamResponse();
});

console.log(`🦊 Hono is running`);

export default hono;
 */
const app = new Elysia()
	.post("/", async ({ request }) => {
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

		return res.toDataStreamResponse();
	})
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
