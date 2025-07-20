"use client"

import type React from "react"
import { useRef } from "react" // Removed useState for input as it's now controlled by useChat
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Send, X, FileText, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  input: string // Now controlled by useChat
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void // Now controlled by useChat
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void // Now controlled by useChat
  onFileUpload: (file: File) => void
  isLoading: boolean
  pdfFileName: string | null
  onRemovePdf: () => void
  isUploadingPdf?: boolean
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  onFileUpload,
  isLoading,
  pdfFileName,
  onRemovePdf,
  isUploadingPdf = false,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      onFileUpload(file)
    } else {
      alert("Please select a valid PDF file.")
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      // Trigger the form submission directly
      handleSubmit(e as any) // Cast to any because KeyboardEvent is not directly FormEvent
    }
  }

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto p-4">
        {/* PDF Upload Status */}
        {pdfFileName && (
          <div className="mb-4 flex items-center justify-between bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">PDF Loaded</span>
                <span className="text-xs text-green-600 dark:text-green-400">{pdfFileName}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemovePdf}
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              value={input} // Bind to useChat's input
              onChange={handleInputChange} // Bind to useChat's handleInputChange
              onKeyDown={handleKeyDown}
              placeholder={
                isUploadingPdf
                  ? "Processing PDF..."
                  : pdfFileName
                    ? "Ask a question about the PDF..."
                    : "Type your message..."
              }
              disabled={isLoading || isUploadingPdf}
              className="pr-12 h-12 text-base rounded-xl border-2 focus:border-blue-500 dark:focus:border-blue-400"
            />
            {(isLoading || isUploadingPdf) && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* File Upload Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleFileButtonClick}
            disabled={isLoading || isUploadingPdf}
            className={cn(
              "h-12 w-12 rounded-xl border-2 transition-all",
              pdfFileName
                ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400"
                : "hover:border-blue-500 dark:hover:border-blue-400",
            )}
          >
            {isUploadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
          </Button>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!input.trim() || isLoading || isUploadingPdf}
            size="icon"
            className="h-12 w-12 rounded-xl bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>

          {/* Hidden File Input */}
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
        </form>

        {/* Helper Text */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Press Enter to send, Shift + Enter for new line</span>
          <span>Supports PDF files up to 10MB</span>
        </div>
      </div>
    </div>
  )
}
