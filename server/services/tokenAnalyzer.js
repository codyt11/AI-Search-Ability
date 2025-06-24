// Simple token estimation (in production, use tiktoken for accurate counts)
export async function analyzeTokens(text) {
  try {
    const tokenEstimate = estimateTokens(text);
    const tokenDistribution = analyzeTokenDistribution(text);
    const efficiencyAnalysis = analyzeTokenEfficiency(text, tokenEstimate);

    return {
      totalTokens: tokenEstimate.total,
      efficiencyScore: efficiencyAnalysis.score,
      headerTokens: tokenDistribution.headers,
      contentTokens: tokenDistribution.content,
      metadataTokens: tokenDistribution.metadata,
      tokensPerWord: tokenEstimate.tokensPerWord,
      redundancyScore: efficiencyAnalysis.redundancy,
      issues: identifyTokenIssues(tokenEstimate, efficiencyAnalysis),
      recommendations: generateTokenRecommendations(
        tokenEstimate,
        efficiencyAnalysis
      ),
    };
  } catch (error) {
    console.error("Token analysis error:", error);
    throw error;
  }
}

function estimateTokens(text) {
  // Rough token estimation (GPT-style)
  // In production, use tiktoken library for accuracy
  const words = text.split(/\s+/).filter((word) => word.trim());
  const totalChars = text.length;

  // Approximate: 1 token ≈ 4 characters for English
  const estimatedTokens = Math.round(totalChars / 4);

  // Alternative word-based estimation
  const wordBasedTokens = Math.round(words.length * 1.3); // ~1.3 tokens per word

  // Use the higher estimate to be conservative
  const finalEstimate = Math.max(estimatedTokens, wordBasedTokens);

  return {
    total: finalEstimate,
    tokensPerWord:
      words.length > 0
        ? Math.round((finalEstimate / words.length) * 100) / 100
        : 0,
    tokensPerChar:
      totalChars > 0
        ? Math.round((finalEstimate / totalChars) * 1000) / 1000
        : 0,
  };
}

function analyzeTokenDistribution(text) {
  const lines = text.split("\n");
  let headerTokens = 0;
  let contentTokens = 0;
  let metadataTokens = 0;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const lineTokens = estimateTokens(trimmed).total;

    // Classify line type
    if (isHeader(trimmed)) {
      headerTokens += lineTokens;
    } else if (isMetadata(trimmed)) {
      metadataTokens += lineTokens;
    } else {
      contentTokens += lineTokens;
    }
  });

  return {
    headers: headerTokens,
    content: contentTokens,
    metadata: metadataTokens,
  };
}

function analyzeTokenEfficiency(text, tokenEstimate) {
  const words = text.split(/\s+/).filter((word) => word.trim());
  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim());

  let efficiencyScore = 100;
  let redundancyScore = 0;

  // Check for redundancy
  const wordFreq = {};
  words.forEach((word) => {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
    if (cleaned.length > 3) {
      // Only count significant words
      wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1;
    }
  });

  // Calculate redundancy
  const redundantWords = Object.values(wordFreq).filter(
    (count) => count > 5
  ).length;
  redundancyScore = Math.min(
    50,
    (redundantWords / Object.keys(wordFreq).length) * 100
  );

  // Check token density (information per token)
  const avgTokensPerSentence = tokenEstimate.total / sentences.length;
  if (avgTokensPerSentence > 30) {
    efficiencyScore -= 15; // Penalize very dense content
  }

  // Check for filler words
  const fillerWords = countFillerWords(text);
  const fillerRatio = fillerWords / words.length;
  if (fillerRatio > 0.15) {
    efficiencyScore -= 20;
  }

  // Adjust for redundancy
  efficiencyScore -= redundancyScore * 0.5;

  return {
    score: Math.max(0, Math.round(efficiencyScore)),
    redundancy: Math.round(redundancyScore),
    avgTokensPerSentence: Math.round(avgTokensPerSentence),
    fillerRatio: Math.round(fillerRatio * 100),
  };
}

function identifyTokenIssues(tokenEstimate, efficiencyAnalysis) {
  const issues = [];

  if (tokenEstimate.total > 4000) {
    issues.push({
      type: "High Token Count",
      description: "Document may exceed typical LLM context windows",
      severity: "high",
    });
  }

  if (efficiencyAnalysis.redundancy > 30) {
    issues.push({
      type: "High Redundancy",
      description: "Content contains excessive repetition",
      severity: "medium",
    });
  }

  if (efficiencyAnalysis.avgTokensPerSentence > 40) {
    issues.push({
      type: "Dense Sentences",
      description: "Sentences are too token-heavy for optimal processing",
      severity: "medium",
    });
  }

  if (efficiencyAnalysis.fillerRatio > 20) {
    issues.push({
      type: "Excessive Filler Words",
      description: "Too many low-value words reduce content efficiency",
      severity: "low",
    });
  }

  return issues;
}

function generateTokenRecommendations(tokenEstimate, efficiencyAnalysis) {
  const recommendations = [];

  if (tokenEstimate.total > 3000) {
    recommendations.push({
      title: "Split Content",
      description:
        "Break document into smaller chunks for better LLM processing",
      expectedImprovement: 20,
    });
  }

  if (efficiencyAnalysis.redundancy > 25) {
    recommendations.push({
      title: "Reduce Redundancy",
      description:
        "Remove repetitive content and consolidate similar information",
      expectedImprovement: 15,
    });
  }

  if (efficiencyAnalysis.fillerRatio > 15) {
    recommendations.push({
      title: "Remove Filler Words",
      description: "Eliminate unnecessary words to improve token efficiency",
      expectedImprovement: 10,
    });
  }

  if (tokenEstimate.tokensPerWord > 1.5) {
    recommendations.push({
      title: "Simplify Vocabulary",
      description: "Use shorter, simpler words to reduce token consumption",
      expectedImprovement: 8,
    });
  }

  return recommendations;
}

// Helper functions
function isHeader(line) {
  return (
    /^#{1,6}\s+/.test(line) || // Markdown headers
    /^[A-Z][^.!?]*:?\s*$/.test(line) || // All caps
    /^\d+\.?\s+[A-Z]/.test(line) || // Numbered
    /^[IVX]+\.?\s+[A-Z]/.test(line)
  ); // Roman numerals
}

function isMetadata(line) {
  return (
    /^(author|date|title|version|created|modified):/i.test(line) ||
    line.match(/^\w+:\s*\w+/)
  ); // Key: value pairs
}

function countFillerWords(text) {
  const fillerWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "very",
    "really",
    "quite",
    "rather",
    "somewhat",
    "actually",
    "basically",
    "literally",
    "obviously",
    "clearly",
  ];

  const words = text.toLowerCase().split(/\s+/);
  return words.filter((word) =>
    fillerWords.includes(word.replace(/[^a-z]/g, ""))
  ).length;
}
