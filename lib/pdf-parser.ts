"use client"; // Mark this file as a client-side module

import * as pdfjsLib from "pdfjs-dist";

// Set the worker source for PDF.js to load from the public directory
// Ensure you have copied 'pdf.worker.min.js' from 'node_modules/pdfjs-dist/build/'
// into your 'public/' directory.
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

/**
 * Extracts text content from a PDF file
 * @param file - The PDF file to parse
 * @returns Promise<string> - The extracted text content
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    // Iterate through all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Extract text from each text item
      const pageText = textContent.items.map((item: any) => item.str).join(" ");

      fullText += pageText + "\n";
    }

    return fullText.trim();
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF file");
  }
}
