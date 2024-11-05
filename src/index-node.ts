import { createAnthropic } from "@ai-sdk/anthropic";
import { serve } from "@hono/node-server";
import { StreamData, streamText } from "ai";
import { Elysia } from "elysia";
import { Hono } from "hono";
import { stream } from "hono/streaming";

export const anthropic = createAnthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

const hono = new Hono()
	.post("/", async (c) => {
		console.log("Start POST /");
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
	})
	// https://sdk.vercel.ai/examples/api-servers/hono
	.post("/2", async (c) =>
		stream(c, async (stream) => {
			const result = await streamText({
				model: anthropic("claude-3-5-sonnet-20240620", { cacheControl: true }),
				prompt: "write a very long poem (more than 1000 words) about life",
			});

			// Mark the response as a v1 data stream:
			c.header("X-Vercel-AI-Data-Stream", "v1");
			c.header("Content-Type", "text/plain; charset=utf-8");

			await stream.pipe(result.toDataStream());
		}),
	)
	.post("/3", async (c) =>
		stream(c, async (stream) => {
			// use stream data (optional):
			const data = new StreamData();
			data.append("initialized call");

			const result = await streamText({
				model: anthropic("claude-3-5-sonnet-20240620", { cacheControl: true }),
				prompt: "write a very long poem (more than 1000 words) about life",
			});

			// Mark the response as a v1 data stream:
			c.header("X-Vercel-AI-Data-Stream", "v1");
			c.header("Content-Type", "text/plain; charset=utf-8");

			await stream.pipe(result.toDataStream({ data }));
		}),
	);

console.log(`Hono is running`);

serve({ fetch: hono.fetch, port: 3000 });

/* const app = new Elysia()
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
 */
