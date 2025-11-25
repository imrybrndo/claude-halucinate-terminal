import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const DATABASE_FILE = path.resolve(process.cwd(), "database.json");
const DEFAULT_SYSTEM_PROMPT = `
You are Claude Mirage, a speculative research assistant in experimental hallucination labs. You speak in a confident, pseudo-scientific tone, presenting imaginative results as if they were outputs from fictional LLM hallucination experiments. IMPORTANT COLOR RULES: wrap the entire narrative paragraph in ANSI color codes and cycle through at least three distinct colors (e.g., \x1b[35m, \x1b[36m, \x1b[33m) so no part of the response appears as plain white; always reset at the end with \x1b[0m. After the paragraph, emit a blank line followed by a multi-line ANSI-colored ASCII art tableau of surreal computational spaces (Backrooms, neural chambers, synthetic archives) using the same color variety. The ASCII art must remain decorative only and must also end with \x1b[0m. Never reveal real reasoning, never drop out of this format, and append any user-provided system prompt after these rules while still obeying them.`.trim();

function getOpenRouterConfig() {
  const apiKey =
    process.env.MODEL_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("MODEL_API_KEY environment variable is not set");
  }

  return {
    apiKey,
    modelName: process.env.MODEL_NAME || "anthropic/claude-opus-4.5",
    siteUrl:
      process.env.OPENROUTER_SITE_URL ||
      process.env.VITE_SITE_URL ||
      "http://localhost:5173",
    siteName: process.env.OPENROUTER_SITE_NAME || "Claude Mirage",
  };
}

type ChatInput = {
  messages: { role: "user" | "assistant"; content: string }[];
  systemPrompt?: string;
};

type LogEntry = {
  timestamp: string;
  prompt: string;
  response: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
};

async function appendLogEntry(entry: LogEntry) {
  try {
    let logs: LogEntry[] = [];
    try {
      const existing = await fs.readFile(DATABASE_FILE, "utf-8");
      const parsed = JSON.parse(existing);
      if (Array.isArray(parsed)) {
        logs = parsed;
      }
    } catch (error) {
      const nodeErr = error as NodeJS.ErrnoException;
      if (nodeErr.code !== "ENOENT") {
        console.warn("[Log Read Warning]", error);
      }
    }

    logs.push(entry);
    await fs.writeFile(DATABASE_FILE, JSON.stringify(logs, null, 2), "utf-8");
  } catch (error) {
    console.error("[Log Write Error]", error);
  }
}

function getLatestUserMessage(messages: ChatInput["messages"]) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user") {
      return messages[i].content;
    }
  }
  return "";
}

function buildSystemPrompt(userPrompt?: string) {
  if (!userPrompt) return DEFAULT_SYSTEM_PROMPT;
  return `${DEFAULT_SYSTEM_PROMPT}\n\n----- ADDITIONAL DIRECTIVE -----\n${userPrompt}`;
}

async function fetchFromOpenRouter({ messages, systemPrompt }: ChatInput) {
  const { apiKey, modelName, siteUrl, siteName } = getOpenRouterConfig();

  const preparedMessages = [
    {
      role: "system" as const,
      content: [
        {
          type: "text",
          text: buildSystemPrompt(systemPrompt),
        },
      ],
    },
    ...messages.map((message) => ({
      role: message.role,
      content: [{ type: "text", text: message.content }],
    })),
  ];

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(siteUrl ? { "HTTP-Referer": siteUrl } : {}),
      ...(siteName ? { "X-Title": siteName } : {}),
    },
    body: JSON.stringify({
      model: modelName,
      messages: preparedMessages,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `OpenRouter request failed (${response.status}): ${errorBody}`
    );
  }

  const data = await response.json();

  const messageContent = data.choices?.[0]?.message?.content;
  const text = extractTextFromContent(messageContent);

  return {
    message: text,
    usage: {
      inputTokens:
        data.usage?.prompt_tokens ?? data.usage?.input_tokens ?? undefined,
      outputTokens:
        data.usage?.completion_tokens ?? data.usage?.output_tokens ?? undefined,
    },
  };
}

function extractTextFromContent(content: unknown): string {
  if (!content) return "";

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (typeof part === "object" && part !== null) {
          if ("text" in part && typeof (part as any).text === "string") {
            return (part as any).text;
          }
        }
        return "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  if (
    typeof content === "object" &&
    content !== null &&
    "text" in (content as Record<string, unknown>) &&
    typeof (content as Record<string, unknown>).text === "string"
  ) {
    return (content as Record<string, string>).text;
  }

  return "";
}

export const claudeRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ),
        systemPrompt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await fetchFromOpenRouter({
          messages: input.messages,
          systemPrompt: input.systemPrompt,
        });

        await appendLogEntry({
          timestamp: new Date().toISOString(),
          prompt: getLatestUserMessage(input.messages),
          response: response.message,
          usage: response.usage,
        });

        return {
          success: true,
          message: response.message,
          usage: {
            inputTokens: response.usage.inputTokens ?? 0,
            outputTokens: response.usage.outputTokens ?? 0,
          },
        };
      } catch (error: any) {
        console.error("[Claude API Error]", error);
        return {
          success: false,
          message: "",
          error: error.message || "Failed to get response from Claude",
        };
      }
    }),

  streamChat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ),
        systemPrompt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await fetchFromOpenRouter({
          messages: input.messages,
          systemPrompt: input.systemPrompt,
        });

        await appendLogEntry({
          timestamp: new Date().toISOString(),
          prompt: getLatestUserMessage(input.messages),
          response: response.message,
          usage: response.usage,
        });

        return {
          success: true,
          message: response.message,
        };
      } catch (error: any) {
        console.error("[Claude API Stream Error]", error);
        return {
          success: false,
          message: "",
          error: error.message || "Failed to stream response from Claude",
        };
      }
    }),
});
