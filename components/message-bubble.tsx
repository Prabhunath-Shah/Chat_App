import type { Message } from "@/types";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[85%] gap-3",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
            isUser ? "bg-blue-500 text-white" : "bg-muted border"
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Message Content */}
        <div className="flex flex-col gap-1">
          <div
            className={cn(
              "rounded-2xl px-4 py-3 break-words shadow-sm",
              isUser
                ? "bg-blue-500 text-white rounded-br-md"
                : "bg-muted border rounded-bl-md"
            )}
          >
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            ) : (
              // Apply styling classes to a wrapper div
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown
                  components={{
                    // Custom components to apply Tailwind classes
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc list-inside space-y-1"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside space-y-1"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mt-0" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-2 last:mb-0" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a className="text-blue-500 hover:underline" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-x-auto text-xs">
                          <code className={`language-${match[1]}`} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code
                          className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <span
            className={cn(
              "text-xs px-2",
              isUser
                ? "text-right text-muted-foreground"
                : "text-left text-muted-foreground"
            )}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
