# 🧠 NeuralDeep AI

![NeuralDeep AI Welcome Screen](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RLYHuQvF005bUZyjgELcNDHl8h0Sa5.png)

Welcome to **NeuralDeep AI**, your intelligent companion for real-time conversations and document analysis. This minimalist, single-page chatbot application empowers you to interact with an advanced AI model and gain insights from your PDF documents effortlessly. Designed for clarity and efficiency, NeuralDeep AI provides a seamless and context-aware conversational experience.

## 🌐 Live Demo

🔗 **Visit the App**: [https://neuraldeep.vercel.app/](https://deepneural.vercel.app/)

## ✨ Key Features

NeuralDeep AI is built to be intuitive and powerful, offering a range of features to enhance your interaction:

*   **Intuitive Single-Page Interface**: Experience a clean, uncluttered design with all essential functionalities accessible on one screen. The interface features a prominent header, a dynamic chat display, and a streamlined input area.
*   **Engaging Welcome Experience**: Upon launch, you're greeted with a clear welcome message and direct calls-to-action: "Ask me anything - I'm here to help!" and "Upload a PDF to analyze and discuss its content," making it easy to start your journey.
*   **Real-time AI Conversations**: Engage in fluid, natural dialogues with the underlying Google Gemini AI model. Messages are streamed in real-time, providing an immediate and interactive chat experience.
*   **Intelligent PDF Document Analysis**:
    *   **Effortless Uploads**: Easily upload PDF files directly within the chat interface using the dedicated paperclip icon.
    *   **Content-Based Q&A**: Once a PDF is uploaded, the AI can answer your questions by extracting and understanding the document's content.
    *   **Clear Status Indicators**: Visual cues inform you when a PDF is loaded and ready for analysis, along with its file name.
*   **Context-Aware Dialogue**: The AI maintains a comprehensive understanding of your conversation history, including any uploaded PDF content. This ensures that responses are always coherent, relevant, and build upon previous interactions.
*   **Beautiful Markdown Rendering**: AI responses formatted with Markdown (e.g., **bold**, *italics*, lists, `code blocks`) are automatically rendered for enhanced readability, making complex information easy to digest.
*   **Dynamic Theme Switching**: Seamlessly toggle between light and dark modes with a single click, adapting the interface to your visual preference and environment.
*   **Responsive Design**: Enjoy a consistent and optimized experience across various devices, from desktops to mobile phones.
*   **Robust Error Handling**: User-friendly toast notifications provide clear feedback for any issues, such as API errors or problems during PDF uploads.

## 🚀 How to Use NeuralDeep AI

Getting started with NeuralDeep AI is straightforward:

1.  **Access the Application**:
    *   If you've downloaded and set up the project locally, open your web browser and navigate to `http://localhost:3000`.
    *   If you're using a deployed version, simply visit the provided URL.

2.  **Start a Conversation**:
    *   Locate the "Type your message..." input field at the bottom of the screen.
    *   Type your question or statement.
    *   Press the `Enter` key to send your message. The AI will process your input and stream its response back to you.
    *   To add a new line within the input field without sending the message, press `Shift + Enter`.

3.  **Upload a PDF Document**:
    *   Click the **paperclip icon** (📎) next to the message input field.
    *   A file selection dialog will appear. Choose a PDF file from your computer (files up to 10MB are supported).
    *   Once uploaded, a green banner will appear at the top of the input area, indicating that the PDF is loaded and ready for analysis.
    *   You can now ask the AI questions directly related to the content of your uploaded PDF.

4.  **Remove a Loaded PDF**:
    *   If a PDF is currently loaded, you'll see its file name in a green banner above the input field.
    *   Click the **'X' icon** on this banner to remove the PDF context. The AI will then revert to general conversation mode.

5.  **Toggle Light/Dark Mode**:
    *   In the top right corner of the header, click the **sun/moon icon** (☀️/🌙) to switch between the light and dark themes.

## 🛠️ How to Develop NeuralDeep AI (Getting Started for Developers)

If you've downloaded the source code and wish to contribute or customize NeuralDeep AI, follow these steps to set up your local development environment.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Version 18.x or higher.
*   **npm** or **pnpm**: A package manager (pnpm is recommended for faster installations).
*   **Google Gemini API Key**: You'll need an API key to connect to the AI model. Obtain one from the [Google AI Studio](https://ai.google.dev/).

### Installation Steps

1.  **Clone the Repository**:
    First, get a copy of the project's source code.
    ```bash
    git clone https://github.com/your-username/neuraldeep-ai.git
    cd neuraldeep-ai
    ```
    *(Remember to replace `your-username/neuraldeep-ai.git` with your actual repository URL if you've forked it.)*

2.  **Install Dependencies**:
    Navigate to the project root and install all required packages.
    Using **pnpm** (recommended):
    ```bash
    pnpm install
    ```
    Or using **npm**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a file named `.env.local` in the root directory of your project. This file will store your sensitive API key.
    ```
    GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key_here
    ```
    **Important**: Replace `your_google_gemini_api_key_here` with the actual API key you obtained from Google AI Studio. This key is crucial for the AI functionality.

4.  **Prepare PDF.js Worker File**:
    The `pdfjs-dist` library, used for PDF parsing, requires a worker script to run in the browser. You need to copy this file from the installed package to your public assets.
    *   Locate the file: `node_modules/pdfjs-dist/build/pdf.worker.min.js`
    *   Copy this file into your project's `public/` directory. If the `public` folder doesn't exist, create it in the root of your project.
    *   The final path should be: `public/pdf.worker.min.js`

### Running the Development Server

Once all prerequisites are met and files are in place, you can start the development server:

```bash
pnpm run dev
# or
npm run dev
```

The application will typically become accessible at `http://localhost:3000` in your web browser. Any changes you make to the code will trigger a hot reload, allowing for rapid development.

## 📁 Project Structure (For Developers)

Understanding the project's layout can help you navigate and contribute effectively:

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Backend API route: Handles AI model communication, context, and PDF integration.
│   ├── components/
│   │   ├── chat-messages.tsx      # Renders the main chat history display area.
│   │   ├── chat-input.tsx         # Manages user input, send button, and PDF file upload.
│   │   ├── message-bubble.tsx     # Displays individual messages with user/AI styling and Markdown rendering.
│   │   └── theme-toggle.tsx       # UI component for switching between light and dark themes.
│   ├── lib/
│   │   └── pdf-parser.ts          # Client-side utility for extracting text from PDF files.
│   ├── page.tsx                   # The main client-side page component, orchestrating the chat UI.
│   └── layout.tsx                 # Root layout for the Next.js application, including the ThemeProvider.
├── components/
│   └── ui/                        # Re-usable Shadcn UI components (e.g., button, input, toast).
├── hooks/
│   └── use-toast.ts               # Custom hook for displaying transient notifications.
├── lib/
│   └── utils.ts                   # General utility functions (e.g., `cn` for conditional Tailwind classes).
├── types/
│   └── index.ts                   # TypeScript interface definitions for data structures (e.g., `Message`).
├── public/
│   └── pdf.worker.min.js          # Essential PDF.js worker script for client-side PDF parsing.
├── .env.local                     # Local environment variables (e.g., API keys).
├── package.json                   # Project metadata, scripts, and dependency list.
├── tailwind.config.ts             # Tailwind CSS configuration file.
├── postcss.config.js              # PostCSS configuration for Tailwind CSS.
└── tsconfig.json                  # TypeScript compiler configuration.
```

## 🛣️ Future Enhancements

We're always looking to improve NeuralDeep AI. Here are some ideas for future development:

*   **Persistent Chat History**: Implement local storage or integrate with a database (e.g., Supabase, MongoDB) to save and retrieve conversation history across user sessions.
*   **Multiple Document Support**: Enhance the PDF functionality to allow users to upload and query multiple PDF documents simultaneously.
*   **Integrated Document Preview**: Add a built-in PDF viewer to display the uploaded document directly within the application alongside the chat.
*   **Advanced Markdown & Code Highlighting**: Improve Markdown rendering for more complex elements and add syntax highlighting for code blocks in AI responses.
*   **Conversation Summarization**: Introduce a feature to generate concise summaries of long chat conversations.
*   **User Authentication**: Implement user authentication (e.g., using NextAuth.js) to personalize experiences and manage individual user conversations securely.
*   **API Rate Limiting**: Add server-side rate limiting to the API routes to prevent abuse and ensure fair usage.
*   **Streaming PDF Processing Feedback**: Provide more granular real-time progress updates during PDF parsing for very large documents.
*   **Voice Input/Output**: Explore integrating speech-to-text and text-to-speech capabilities for hands-free interaction.

## 🤝 Contributing

Contributions are highly welcome! If you have ideas, bug reports, or wish to contribute code, please follow these steps:

1.  **Fork the repository**.
2.  Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`
3.  Make your changes and ensure they adhere to the project's coding style.
4.  Commit your changes with a clear and concise message: `git commit -m 'feat: Add new feature'`
5.  Push your branch to your forked repository: `git push origin feature/your-feature-name`
6.  Open a Pull Request to the main repository, describing your changes in detail.

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

## ✉️ Contact

For any questions, feedback, or support, please feel free to reach out:

*   **Your Name/Handle**: [Your GitHub Profile/Email]
*   **Project Repository**: [https://github.com/your-username/neuraldeep-ai](https://github.com/your-username/neuraldeep-ai) (Please update this link to your actual repository URL)
