"use client";

import { useState } from "react";
import { useChat } from "ai/react";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";
import { ThemeToggle } from "@/components/theme-toggle";
// Removed direct import: import { extractTextFromPDF } from "@/lib/pdf-parser"
import type { Message } from "@/types";
import { Sparkles, FileText, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ChatPage() {
  const [pdfContent, setPdfContent] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const { toast } = useToast();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      pdfContent,
    },
    onError: (error) => {
      console.error("Chat API Error:", error);
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      // Attempt to parse the error response from the server if it's a network error
      if (
        (error as any).response &&
        typeof (error as any).response.json === "function"
      ) {
        (error as any).response
          .json()
          .then((data: any) => {
            console.error("API Response Error Data:", data);
            toast({
              title: "Error",
              description: `Failed to send message: ${
                data.error || data.details || errorMessage
              }`,
              variant: "destructive",
            });
          })
          .catch(() => {
            // Fallback if JSON parsing fails
            toast({
              title: "Error",
              description: `Failed to send message: ${errorMessage}`,
              variant: "destructive",
            });
          });
      } else {
        toast({
          title: "Error",
          description: `Failed to send message: ${errorMessage}`,
          variant: "destructive",
        });
      }
    },
  });

  // Convert useChat messages to our Message type
  const typedMessages: Message[] = messages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant",
    content: msg.content,
    timestamp: new Date(msg.createdAt || Date.now()),
  }));

  const handleFileUpload = async (file: File) => {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a PDF file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingPdf(true);
    try {
      // Dynamically import extractTextFromPDF here
      const { extractTextFromPDF } = await import("@/lib/pdf-parser");
      const text = await extractTextFromPDF(file);

      if (!text.trim()) {
        toast({
          title: "Empty PDF",
          description:
            "The PDF appears to be empty or contains no readable text.",
          variant: "destructive",
        });
        return;
      }

      setPdfContent(text);
      setPdfFileName(file.name);

      // Add a system message to indicate PDF was uploaded
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        role: "assistant",
        content: `📄 PDF "${
          file.name
        }" has been uploaded successfully! I can now answer questions about its content. The document contains ${Math.round(
          text.length / 1000
        )}k characters of text.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [
        ...prev,
        {
          id: systemMessage.id,
          role: systemMessage.role,
          content: systemMessage.content,
          createdAt: systemMessage.timestamp,
        },
      ]);

      toast({
        title: "PDF uploaded successfully",
        description: `"${file.name}" is ready for analysis.`,
      });
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast({
        title: "Upload failed",
        description: "Failed to process the PDF file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const handleRemovePdf = () => {
    setPdfContent(null);
    setPdfFileName(null);

    // Add a system message to indicate PDF was removed
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      role: "assistant",
      content:
        "📄 PDF has been removed. You can now have a general conversation or upload a new PDF document.",
      timestamp: new Date(),
    };

    setMessages((prev) => [
      ...prev,
      {
        id: systemMessage.id,
        role: systemMessage.role,
        content: systemMessage.content,
        createdAt: systemMessage.timestamp,
      },
    ]);

    toast({
      title: "PDF removed",
      description: "You can now upload a new document or continue chatting.",
    });
  };

  const messageCount = typedMessages.filter((m) => m.role === "user").length;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NeuralDeep AI
                </h1>
                <p className="text-sm text-muted-foreground">
                  Intelligent document analysis and conversation
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Stats */}
              <div className="hidden sm:flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{messageCount} messages</span>
                </div>
                {pdfFileName && (
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4 text-green-500" />
                    <span>PDF loaded</span>
                  </div>
                )}
              </div>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-h-0">
        <ChatMessages
          messages={typedMessages}
          isLoading={isLoading}
          pdfFileName={pdfFileName}
        />

        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
          isUploadingPdf={isUploadingPdf}
          pdfFileName={pdfFileName}
          onRemovePdf={handleRemovePdf}
        />
      </main>
    </div>
  );
}
