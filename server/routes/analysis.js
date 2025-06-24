import express from "express";
import fs from "fs/promises";
import path from "path";
import { upload } from "../middleware/upload.js";
import { analyzeDocument } from "../services/documentAnalyzer.js";
import { analyzeStructure } from "../services/structureAnalyzer.js";
import { analyzeTokens } from "../services/tokenAnalyzer.js";
import { analyzeEmbeddings } from "../services/embeddingAnalyzer.js";
import { analyzePromptCoverage } from "../services/promptAnalyzer.js";
import { identifyContentGaps } from "../services/contentGapAnalyzer.js";

const router = express.Router();

// Store for analysis results (in production, use a database)
const analysisResults = new Map();

router.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    console.log(`Analyzing file: ${file.originalname} (${file.mimetype})`);

    // Extract text content based on file type
    let textContent = "";
    try {
      textContent = await analyzeDocument(file.path, file.mimetype);
    } catch (error) {
      console.error("Document analysis error:", error);
      return res
        .status(400)
        .json({ error: "Failed to extract content from file" });
    }

    if (!textContent || textContent.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "No readable content found in file" });
    }

    // Perform comprehensive analysis
    const [
      structureAnalysis,
      tokenAnalysis,
      embeddingAnalysis,
      promptAnalysis,
      contentGaps,
    ] = await Promise.all([
      analyzeStructure(textContent),
      analyzeTokens(textContent),
      analyzeEmbeddings(textContent),
      analyzePromptCoverage(textContent),
      identifyContentGaps(textContent),
    ]);

    // Calculate overall scores
    const overallScore = Math.round(
      (structureAnalysis.score +
        tokenAnalysis.efficiencyScore +
        embeddingAnalysis.score +
        promptAnalysis.coverageScore) /
        4
    );

    // Compile analysis result
    const analysisResult = {
      id: Date.now().toString(),
      filename: file.originalname,
      fileType: getFileTypeDisplay(file.mimetype),
      fileSize: formatFileSize(file.size),
      timestamp: new Date().toISOString(),

      // Scores
      overallScore,
      structureScore: structureAnalysis.score,
      clarityScore: structureAnalysis.clarityScore,
      tokenEfficiency: tokenAnalysis.efficiencyScore,
      embeddingPotential: embeddingAnalysis.score,
      promptCoverage: promptAnalysis.coverageScore,

      // Detailed metrics
      tokenCount: tokenAnalysis.totalTokens,
      readabilityLevel: structureAnalysis.readabilityLevel,
      avgSentenceLength: structureAnalysis.avgSentenceLength,
      complexWordsPercent: structureAnalysis.complexWordsPercent,
      potentialImprovement: calculatePotentialImprovement([
        structureAnalysis,
        tokenAnalysis,
        embeddingAnalysis,
        promptAnalysis,
      ]),

      // Token breakdown
      tokenAnalysis: {
        headers: tokenAnalysis.headerTokens,
        content: tokenAnalysis.contentTokens,
        metadata: tokenAnalysis.metadataTokens,
      },

      // Issues and recommendations
      issues: combineIssues([
        structureAnalysis.issues,
        tokenAnalysis.issues,
        embeddingAnalysis.issues,
        promptAnalysis.issues,
      ]),

      recommendations: combineRecommendations([
        structureAnalysis.recommendations,
        tokenAnalysis.recommendations,
        embeddingAnalysis.recommendations,
        promptAnalysis.recommendations,
      ]),

      // Content gaps
      contentGaps: contentGaps.gaps,
    };

    // Store result (in production, save to database)
    analysisResults.set(analysisResult.id, analysisResult);

    // Clean up uploaded file
    try {
      await fs.unlink(file.path);
    } catch (cleanupError) {
      console.error("Failed to clean up uploaded file:", cleanupError);
    }

    res.json(analysisResult);
  } catch (error) {
    console.error("Analysis error:", error);

    // Clean up file if it exists
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error("Failed to clean up file after error:", cleanupError);
      }
    }

    res.status(500).json({
      error: "Analysis failed",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

router.get("/analyses/recent", (req, res) => {
  const recent = Array.from(analysisResults.values())
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10)
    .map((result) => ({
      id: result.id,
      filename: result.filename,
      fileType: result.fileType,
      overallScore: result.overallScore,
      timestamp: result.timestamp,
      issues: result.issues.slice(0, 3), // Just show first 3 issues
    }));

  res.json(recent);
});

router.get("/analyses/:id", (req, res) => {
  const analysis = analysisResults.get(req.params.id);
  if (!analysis) {
    return res.status(404).json({ error: "Analysis not found" });
  }
  res.json(analysis);
});

router.delete("/analyses/:id", (req, res) => {
  const deleted = analysisResults.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Analysis not found" });
  }
  res.json({ message: "Analysis deleted successfully" });
});

// Helper functions
function getFileTypeDisplay(mimetype) {
  const typeMap = {
    "application/pdf": "PDF",
    "text/html": "HTML",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "application/msword": "DOC",
    "text/plain": "TXT",
  };
  return typeMap[mimetype] || "Unknown";
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function calculatePotentialImprovement(analyses) {
  const improvements = analyses
    .flatMap((analysis) => analysis.recommendations || [])
    .map((rec) => rec.expectedImprovement || 0);

  return improvements.length > 0
    ? Math.round(
        improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length
      )
    : 0;
}

function combineIssues(issueArrays) {
  return issueArrays
    .flat()
    .filter((issue) => issue && issue.type)
    .slice(0, 10); // Limit to top 10 issues
}

function combineRecommendations(recommendationArrays) {
  return recommendationArrays
    .flat()
    .filter((rec) => rec && rec.title)
    .slice(0, 8); // Limit to top 8 recommendations
}

export default router;
