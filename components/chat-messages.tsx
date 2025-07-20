"use client"

import { useEffect, useRef } from "react"
import type { Message } from "@/types"
import { MessageBubble } from "./message-bubble"
import { FileText, MessageCircle, Sparkles } from "lucide-react"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  pdfFileName?: string | null
}

export function ChatMessages({ messages, isLoading, pdfFileName }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center space-y-6 max-w-md">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Welcome to NeuralDeep AI</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Start a conversation with AI or upload a PDF document to ask questions about its content.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                  <MessageCircle className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>Ask me anything - I'm here to help!</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                  <FileText className="h-4 w-4 text-green-500 shrink-0" />
                  <span>Upload a PDF to analyze and discuss its content</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-muted border">
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
              </div>
              <div className="bg-muted border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
