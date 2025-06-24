import fs from "fs/promises";
import mammoth from "mammoth";
import { parse } from "node-html-parser";

export async function analyzeDocument(filePath, mimeType) {
  try {
    switch (mimeType) {
      case "application/pdf":
        return await extractFromPDF(filePath);

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword":
        return await extractFromDocx(filePath);

      case "text/html":
        return await extractFromHTML(filePath);

      case "text/plain":
        return await extractFromText(filePath);

      default:
        throw new Error(`Unsupported file type: ${mimeType}`);
    }
  } catch (error) {
    console.error(`Error analyzing document ${filePath}:`, error);
    throw error;
  }
}

async function extractFromPDF(filePath) {
  try {
    // Dynamic import to avoid test file loading issues
    const pdfParse = (await import("pdf-parse")).default;
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return cleanText(data.text);
  } catch (error) {
    throw new Error(`Failed to extract PDF content: ${error.message}`);
  }
}

async function extractFromDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return cleanText(result.value);
  } catch (error) {
    throw new Error(`Failed to extract DOCX content: ${error.message}`);
  }
}

async function extractFromHTML(filePath) {
  try {
    const htmlContent = await fs.readFile(filePath, "utf-8");
    const root = parse(htmlContent);

    // Remove script and style elements
    root.querySelectorAll("script, style").forEach((el) => el.remove());

    // Extract text content
    const textContent = root.text;
    return cleanText(textContent);
  } catch (error) {
    throw new Error(`Failed to extract HTML content: ${error.message}`);
  }
}

async function extractFromText(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return cleanText(content);
  } catch (error) {
    throw new Error(`Failed to extract text content: ${error.message}`);
  }
}

function cleanText(text) {
  if (!text) return "";

  return (
    text
      // Remove excessive whitespace
      .replace(/\s+/g, " ")
      // Remove multiple newlines
      .replace(/\n\s*\n/g, "\n")
      // Trim whitespace
      .trim()
  );
}

export function getDocumentMetadata(text) {
  const lines = text.split("\n").filter((line) => line.trim());
  const words = text.split(/\s+/).filter((word) => word.trim());
  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim());

  return {
    lineCount: lines.length,
    wordCount: words.length,
    sentenceCount: sentences.length,
    characterCount: text.length,
    avgWordsPerSentence:
      sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
    avgCharsPerWord:
      words.length > 0 ? Math.round(text.length / words.length) : 0,
  };
}
