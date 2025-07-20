export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  pdfContent: string | null
  pdfFileName: string | null
}

export interface ChatStats {
  messageCount: number
  pdfUploaded: boolean
  conversationStarted: Date | null
}
