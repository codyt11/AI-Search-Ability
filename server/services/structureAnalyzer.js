import { getDocumentMetadata } from "./documentAnalyzer.js";

export async function analyzeStructure(text) {
  try {
    const metadata = getDocumentMetadata(text);
    const headerAnalysis = analyzeHeaders(text);
    const readabilityAnalysis = analyzeReadability(text);
    const clarityAnalysis = analyzeClarity(text);

    // Calculate overall structure score
    const structureScore = calculateStructureScore({
      headerAnalysis,
      readabilityAnalysis,
      clarityAnalysis,
      metadata,
    });

    return {
      score: structureScore,
      clarityScore: clarityAnalysis.score,
      readabilityLevel: readabilityAnalysis.level,
      avgSentenceLength: metadata.avgWordsPerSentence,
      complexWordsPercent: readabilityAnalysis.complexWordsPercent,
      headerCount: headerAnalysis.count,
      headerStructure: headerAnalysis.structure,
      issues: identifyStructureIssues({
        headerAnalysis,
        readabilityAnalysis,
        clarityAnalysis,
        metadata,
      }),
      recommendations: generateStructureRecommendations({
        headerAnalysis,
        readabilityAnalysis,
        clarityAnalysis,
        metadata,
      }),
    };
  } catch (error) {
    console.error("Structure analysis error:", error);
    throw error;
  }
}

function analyzeHeaders(text) {
  const lines = text.split("\n");
  const headers = [];
  const headerPatterns = [
    /^#{1,6}\s+.+/, // Markdown headers
    /^[A-Z][^.!?]*:?\s*$/, // All caps potential headers
    /^\d+\.?\s+[A-Z]/, // Numbered headers
    /^[IVX]+\.?\s+[A-Z]/, // Roman numeral headers
  ];

  let currentLevel = 0;
  const structure = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.length === 0) return;

    // Check for markdown headers
    const markdownMatch = trimmed.match(/^(#{1,6})\s+(.+)/);
    if (markdownMatch) {
      const level = markdownMatch[1].length;
      headers.push({
        text: markdownMatch[2],
        level,
        type: "markdown",
      });
      structure.push(level);
      return;
    }

    // Check other header patterns
    for (const pattern of headerPatterns) {
      if (pattern.test(trimmed)) {
        const level = estimateHeaderLevel(trimmed, currentLevel);
        headers.push({
          text: trimmed,
          level,
          type: "inferred",
        });
        structure.push(level);
        currentLevel = level;
        break;
      }
    }
  });

  return {
    count: headers.length,
    headers,
    structure,
    hierarchyScore: calculateHierarchyScore(structure),
  };
}

function analyzeReadability(text) {
  const words = text.split(/\s+/).filter((word) => word.trim());
  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim());

  if (sentences.length === 0 || words.length === 0) {
    return {
      score: 0,
      level: "Unknown",
      complexWordsPercent: 0,
    };
  }

  const avgSentenceLength = words.length / sentences.length;
  const complexWords = words.filter((word) => isComplexWord(word)).length;
  const complexWordsPercent = Math.round((complexWords / words.length) * 100);

  // Simplified Flesch-Kincaid Grade Level
  const gradeLevel =
    0.39 * avgSentenceLength + 11.8 * (complexWords / words.length) - 15.59;

  let readabilityScore = 100;
  if (gradeLevel > 16) readabilityScore = 30;
  else if (gradeLevel > 13) readabilityScore = 50;
  else if (gradeLevel > 10) readabilityScore = 70;
  else if (gradeLevel > 8) readabilityScore = 85;

  return {
    score: Math.max(0, Math.min(100, readabilityScore)),
    level: getReadabilityLevel(gradeLevel),
    complexWordsPercent,
    avgSentenceLength: Math.round(avgSentenceLength),
    gradeLevel: Math.round(gradeLevel),
  };
}

function analyzeClarity(text) {
  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim());
  const words = text.split(/\s+/).filter((word) => word.trim());

  let clarityScore = 100;
  const issues = [];

  // Check for overly long sentences (reduce clarity)
  const longSentences = sentences.filter(
    (sentence) => sentence.split(/\s+/).length > 25
  ).length;

  if (longSentences > sentences.length * 0.3) {
    clarityScore -= 20;
    issues.push("Too many long sentences");
  }

  // Check for passive voice (approximate)
  const passiveVoice = sentences.filter((sentence) =>
    /\b(was|were|been|being)\s+\w+ed\b/.test(sentence.toLowerCase())
  ).length;

  if (passiveVoice > sentences.length * 0.4) {
    clarityScore -= 15;
    issues.push("Excessive passive voice");
  }

  // Check for jargon and complex terms
  const jargonWords = words.filter((word) => isJargon(word)).length;
  if (jargonWords > words.length * 0.1) {
    clarityScore -= 10;
    issues.push("High jargon content");
  }

  return {
    score: Math.max(0, clarityScore),
    issues,
  };
}

function calculateStructureScore(analysis) {
  let score = 100;

  // Header structure (30% weight)
  score *= 0.7;
  score += analysis.headerAnalysis.hierarchyScore * 0.3;

  // Readability (40% weight)
  score *= 0.6;
  score += (analysis.readabilityAnalysis.score / 100) * 0.4;

  // Clarity (30% weight)
  score *= 0.7;
  score += (analysis.clarityAnalysis.score / 100) * 0.3;

  return Math.round(Math.max(0, Math.min(100, score)));
}

function identifyStructureIssues(analysis) {
  const issues = [];

  if (analysis.headerAnalysis.count === 0) {
    issues.push({
      type: "Missing Headers",
      description:
        "Document lacks clear section headers for better organization",
      severity: "high",
    });
  }

  if (analysis.readabilityAnalysis.gradeLevel > 16) {
    issues.push({
      type: "High Reading Level",
      description: "Content is too complex for general audiences",
      severity: "medium",
    });
  }

  if (analysis.metadata.avgWordsPerSentence > 25) {
    issues.push({
      type: "Long Sentences",
      description: "Sentences are too long, reducing readability",
      severity: "medium",
    });
  }

  if (analysis.clarityAnalysis.issues.length > 0) {
    analysis.clarityAnalysis.issues.forEach((issue) => {
      issues.push({
        type: "Clarity Issue",
        description: issue,
        severity: "low",
      });
    });
  }

  return issues;
}

function generateStructureRecommendations(analysis) {
  const recommendations = [];

  if (analysis.headerAnalysis.count < 3 && analysis.metadata.wordCount > 500) {
    recommendations.push({
      title: "Add Section Headers",
      description: "Break content into clear sections with descriptive headers",
      expectedImprovement: 15,
    });
  }

  if (analysis.readabilityAnalysis.complexWordsPercent > 20) {
    recommendations.push({
      title: "Simplify Language",
      description:
        "Replace complex terms with simpler alternatives where possible",
      expectedImprovement: 12,
    });
  }

  if (analysis.metadata.avgWordsPerSentence > 20) {
    recommendations.push({
      title: "Shorten Sentences",
      description: "Break long sentences into shorter, more digestible chunks",
      expectedImprovement: 10,
    });
  }

  return recommendations;
}

// Helper functions
function estimateHeaderLevel(text, currentLevel) {
  if (text.match(/^\d+\./)) return 1; // Numbered section
  if (text.match(/^[a-z]\)/)) return currentLevel + 1; // Subsection
  if (text.length < 50 && text === text.toUpperCase()) return 1;
  return Math.max(1, currentLevel);
}

function calculateHierarchyScore(structure) {
  if (structure.length === 0) return 0;

  let score = 50; // Base score for having headers

  // Bonus for proper hierarchy (ascending levels)
  let properTransitions = 0;
  for (let i = 1; i < structure.length; i++) {
    if (structure[i] <= structure[i - 1] + 1) {
      properTransitions++;
    }
  }

  if (structure.length > 1) {
    score += (properTransitions / (structure.length - 1)) * 50;
  }

  return Math.round(score);
}

function isComplexWord(word) {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  return (
    cleaned.length > 6 ||
    cleaned.match(/tion$|sion$|ment$|ness$|ical$|ible$|able$/)
  );
}

function isJargon(word) {
  const jargonPatterns = [
    /ization$/,
    /methodology/,
    /paradigm/,
    /synergy/,
    /optimization/,
    /implementation/,
  ];

  return jargonPatterns.some((pattern) => pattern.test(word.toLowerCase()));
}

function getReadabilityLevel(gradeLevel) {
  if (gradeLevel <= 8) return "Elementary";
  if (gradeLevel <= 12) return "High School";
  if (gradeLevel <= 16) return "College";
  return "Graduate";
}
