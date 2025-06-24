export async function analyzeEmbeddings(text) {
  try {
    const semanticAnalysis = analyzeSemanticRichness(text);
    const structuralAnalysis = analyzeEmbeddingStructure(text);
    const contextualAnalysis = analyzeContextualCoherence(text);

    const overallScore = calculateEmbeddingScore({
      semanticAnalysis,
      structuralAnalysis,
      contextualAnalysis,
    });

    return {
      score: overallScore,
      semanticRichness: semanticAnalysis.score,
      structuralSuitability: structuralAnalysis.score,
      contextualCoherence: contextualAnalysis.score,
      conceptDensity: semanticAnalysis.conceptDensity,
      topicCoherence: contextualAnalysis.topicCoherence,
      issues: identifyEmbeddingIssues({
        semanticAnalysis,
        structuralAnalysis,
        contextualAnalysis,
      }),
      recommendations: generateEmbeddingRecommendations({
        semanticAnalysis,
        structuralAnalysis,
        contextualAnalysis,
      }),
    };
  } catch (error) {
    console.error("Embedding analysis error:", error);
    throw error;
  }
}

function analyzeSemanticRichness(text) {
  const words = text.split(/\s+/).filter((word) => word.trim());
  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim());

  // Calculate vocabulary diversity
  const uniqueWords = new Set(
    words.map((word) => word.toLowerCase().replace(/[^a-z]/g, ""))
  );
  const vocabularyDiversity = uniqueWords.size / words.length;

  // Identify concept words (nouns, technical terms)
  const conceptWords = words.filter((word) => isConceptWord(word));
  const conceptDensity = conceptWords.length / words.length;

  // Calculate semantic diversity score
  let semanticScore = 0;
  semanticScore += vocabularyDiversity * 40; // 40% weight
  semanticScore += conceptDensity * 60; // 60% weight

  return {
    score: Math.round(Math.min(100, semanticScore * 100)),
    vocabularyDiversity: Math.round(vocabularyDiversity * 100),
    conceptDensity: Math.round(conceptDensity * 100),
    uniqueWordRatio: Math.round((uniqueWords.size / words.length) * 100),
  };
}

function analyzeEmbeddingStructure(text) {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());
  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim());

  let structuralScore = 100;

  // Check paragraph length consistency
  const paragraphLengths = paragraphs.map((p) => p.split(/\s+/).length);
  const avgParagraphLength =
    paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length;

  if (avgParagraphLength < 20) {
    structuralScore -= 15; // Too short for meaningful embeddings
  } else if (avgParagraphLength > 200) {
    structuralScore -= 20; // Too long for coherent embeddings
  }

  // Check sentence coherence within paragraphs
  const coherenceScore = calculateParagraphCoherence(paragraphs);
  structuralScore *= coherenceScore / 100;

  return {
    score: Math.round(Math.max(0, structuralScore)),
    avgParagraphLength: Math.round(avgParagraphLength),
    paragraphCount: paragraphs.length,
    coherenceScore: Math.round(coherenceScore),
  };
}

function analyzeContextualCoherence(text) {
  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim());
  const words = text.split(/\s+/).filter((word) => word.trim());

  // Analyze topic consistency
  const topicWords = extractTopicWords(text);
  const topicCoherence = calculateTopicCoherence(topicWords, sentences);

  // Check for context switches
  const contextSwitches = detectContextSwitches(sentences);
  const contextStability = Math.max(0, 100 - contextSwitches * 10);

  // Calculate overall coherence
  const coherenceScore = (topicCoherence + contextStability) / 2;

  return {
    score: Math.round(coherenceScore),
    topicCoherence: Math.round(topicCoherence),
    contextStability: Math.round(contextStability),
    topicWords: topicWords.length,
    contextSwitches,
  };
}

function calculateEmbeddingScore(analysis) {
  // Weighted average of all components
  const weights = {
    semantic: 0.4,
    structural: 0.3,
    contextual: 0.3,
  };

  return Math.round(
    analysis.semanticAnalysis.score * weights.semantic +
      analysis.structuralAnalysis.score * weights.structural +
      analysis.contextualAnalysis.score * weights.contextual
  );
}

function identifyEmbeddingIssues(analysis) {
  const issues = [];

  if (analysis.semanticAnalysis.conceptDensity < 15) {
    issues.push({
      type: "Low Concept Density",
      description: "Content lacks meaningful concepts for rich embeddings",
      severity: "high",
    });
  }

  if (analysis.structuralAnalysis.avgParagraphLength < 15) {
    issues.push({
      type: "Short Paragraphs",
      description: "Paragraphs too short for meaningful semantic chunks",
      severity: "medium",
    });
  }

  if (analysis.contextualAnalysis.contextSwitches > 10) {
    issues.push({
      type: "Frequent Context Switches",
      description: "Content jumps between topics too frequently",
      severity: "medium",
    });
  }

  if (analysis.semanticAnalysis.vocabularyDiversity < 30) {
    issues.push({
      type: "Limited Vocabulary",
      description: "Repetitive vocabulary reduces embedding richness",
      severity: "low",
    });
  }

  return issues;
}

function generateEmbeddingRecommendations(analysis) {
  const recommendations = [];

  if (analysis.semanticAnalysis.conceptDensity < 20) {
    recommendations.push({
      title: "Increase Concept Density",
      description: "Add more specific terms and technical concepts",
      expectedImprovement: 18,
    });
  }

  if (analysis.structuralAnalysis.avgParagraphLength < 20) {
    recommendations.push({
      title: "Expand Paragraphs",
      description: "Combine related sentences into more substantial paragraphs",
      expectedImprovement: 15,
    });
  }

  if (analysis.contextualAnalysis.topicCoherence < 70) {
    recommendations.push({
      title: "Improve Topic Flow",
      description: "Better organize content to maintain topic coherence",
      expectedImprovement: 12,
    });
  }

  if (analysis.semanticAnalysis.vocabularyDiversity < 40) {
    recommendations.push({
      title: "Diversify Vocabulary",
      description: "Use more varied terminology and synonyms",
      expectedImprovement: 8,
    });
  }

  return recommendations;
}

// Helper functions
function isConceptWord(word) {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");

  // Filter out common words
  const commonWords = new Set([
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
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "among",
    "this",
    "that",
    "these",
    "those",
    "is",
    "was",
    "are",
    "were",
    "been",
    "be",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
  ]);

  if (commonWords.has(cleaned) || cleaned.length < 3) {
    return false;
  }

  // Consider words that are likely to be concepts
  return (
    cleaned.length > 4 || // Longer words
    /tion$|sion$|ment$|ness$|ity$|ism$/.test(cleaned) || // Concept suffixes
    /^[A-Z]/.test(word)
  ); // Proper nouns
}

function extractTopicWords(text) {
  const words = text.split(/\s+/);
  const topicWords = words.filter((word) => isConceptWord(word));

  // Count frequency and return most common topic words
  const frequency = {};
  topicWords.forEach((word) => {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
    frequency[cleaned] = (frequency[cleaned] || 0) + 1;
  });

  return Object.entries(frequency)
    .filter(([word, count]) => count > 1)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word);
}

function calculateTopicCoherence(topicWords, sentences) {
  if (topicWords.length === 0) return 0;

  let coherentSentences = 0;
  sentences.forEach((sentence) => {
    const sentenceWords = sentence.toLowerCase().split(/\s+/);
    const hasTopicWord = topicWords.some((topic) =>
      sentenceWords.some((word) => word.includes(topic))
    );
    if (hasTopicWord) coherentSentences++;
  });

  return (coherentSentences / sentences.length) * 100;
}

function detectContextSwitches(sentences) {
  // Simplified context switch detection
  let switches = 0;
  const contextKeywords = [
    "however",
    "meanwhile",
    "furthermore",
    "additionally",
    "in contrast",
    "on the other hand",
    "alternatively",
    "conversely",
    "nevertheless",
  ];

  sentences.forEach((sentence) => {
    const lower = sentence.toLowerCase();
    if (contextKeywords.some((keyword) => lower.includes(keyword))) {
      switches++;
    }
  });

  return switches;
}

function calculateParagraphCoherence(paragraphs) {
  if (paragraphs.length === 0) return 0;

  let totalCoherence = 0;
  paragraphs.forEach((paragraph) => {
    const sentences = paragraph.split(/[.!?]+/).filter((s) => s.trim());
    if (sentences.length < 2) {
      totalCoherence += 50; // Neutral score for single sentences
      return;
    }

    // Simple coherence measure based on word overlap between sentences
    let coherenceSum = 0;
    for (let i = 1; i < sentences.length; i++) {
      const prev = new Set(sentences[i - 1].toLowerCase().split(/\s+/));
      const curr = new Set(sentences[i].toLowerCase().split(/\s+/));
      const overlap = new Set([...prev].filter((x) => curr.has(x)));
      const coherence = (overlap.size / Math.min(prev.size, curr.size)) * 100;
      coherenceSum += coherence;
    }

    totalCoherence += coherenceSum / (sentences.length - 1);
  });

  return totalCoherence / paragraphs.length;
}
