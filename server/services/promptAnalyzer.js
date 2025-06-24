export async function analyzePromptCoverage(text) {
  try {
    const commonPrompts = getCommonPrompts();
    const promptCoverage = analyzeCoverageForPrompts(text, commonPrompts);
    const answerability = analyzeAnswerability(text);
    const completeness = analyzeCompleteness(text);

    const coverageScore = calculatePromptCoverageScore({
      promptCoverage,
      answerability,
      completeness,
    });

    return {
      coverageScore,
      promptMatches: promptCoverage.matches,
      answerabilityScore: answerability.score,
      completenessScore: completeness.score,
      missingPromptTypes: promptCoverage.missing,
      issues: identifyPromptIssues({
        promptCoverage,
        answerability,
        completeness,
      }),
      recommendations: generatePromptRecommendations({
        promptCoverage,
        answerability,
        completeness,
      }),
    };
  } catch (error) {
    console.error("Prompt analysis error:", error);
    throw error;
  }
}

function getCommonPrompts() {
  return {
    "What is": {
      patterns: ["what is", "what are", "define", "definition of"],
      weight: 0.2,
      type: "definition",
    },
    "How to": {
      patterns: ["how to", "how do", "how can", "steps to", "process"],
      weight: 0.25,
      type: "instruction",
    },
    Why: {
      patterns: ["why", "reason", "because", "purpose", "benefit"],
      weight: 0.15,
      type: "explanation",
    },
    When: {
      patterns: ["when", "timing", "schedule", "time"],
      weight: 0.1,
      type: "temporal",
    },
    Where: {
      patterns: ["where", "location", "place"],
      weight: 0.1,
      type: "location",
    },
    Examples: {
      patterns: ["example", "for instance", "such as", "including"],
      weight: 0.15,
      type: "example",
    },
    Comparison: {
      patterns: ["vs", "versus", "compared to", "difference", "similar"],
      weight: 0.05,
      type: "comparison",
    },
  };
}

function analyzeCoverageForPrompts(text, prompts) {
  const lowerText = text.toLowerCase();
  const matches = {};
  const missing = [];

  Object.entries(prompts).forEach(([promptType, config]) => {
    let found = false;
    let matchCount = 0;

    config.patterns.forEach((pattern) => {
      const regex = new RegExp(`\\b${pattern}\\b`, "gi");
      const patternMatches = (lowerText.match(regex) || []).length;
      if (patternMatches > 0) {
        found = true;
        matchCount += patternMatches;
      }
    });

    if (found) {
      matches[promptType] = {
        count: matchCount,
        weight: config.weight,
        type: config.type,
      };
    } else {
      missing.push({
        type: promptType,
        weight: config.weight,
        expectedPatterns: config.patterns,
      });
    }
  });

  return { matches, missing };
}

function analyzeAnswerability(text) {
  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim());

  let answerableScore = 0;
  let questionWords = 0;
  let answerWords = 0;

  // Look for question and answer patterns
  sentences.forEach((sentence) => {
    const lower = sentence.toLowerCase().trim();

    // Question indicators
    if (
      /\b(what|how|why|when|where|who|which)\b/.test(lower) ||
      lower.endsWith("?")
    ) {
      questionWords++;
    }

    // Answer indicators
    if (
      /\b(is|are|means|refers|involves|includes)\b/.test(lower) ||
      /\b(because|due to|results in|leads to)\b/.test(lower) ||
      /\b(for example|such as|including)\b/.test(lower)
    ) {
      answerWords++;
    }
  });

  // Calculate answerability based on ratio of answers to questions
  if (questionWords === 0) {
    answerableScore = answerWords > 0 ? 80 : 60; // Declarative content
  } else {
    const answerRatio = answerWords / (questionWords + answerWords);
    answerableScore = answerRatio * 100;
  }

  return {
    score: Math.round(Math.min(100, answerableScore)),
    questionCount: questionWords,
    answerCount: answerWords,
    ratio:
      questionWords > 0
        ? Math.round((answerWords / questionWords) * 100) / 100
        : 0,
  };
}

function analyzeCompleteness(text) {
  const sections = identifyContentSections(text);
  let completenessScore = 0;

  const expectedSections = [
    "introduction",
    "definition",
    "explanation",
    "examples",
    "conclusion",
  ];

  const foundSections = sections.filter((section) =>
    expectedSections.some((expected) => section.type.includes(expected))
  );

  completenessScore = (foundSections.length / expectedSections.length) * 100;

  // Bonus for comprehensive coverage
  if (sections.length >= 5) completenessScore += 10;
  if (hasGoodStructure(text)) completenessScore += 15;

  return {
    score: Math.round(Math.min(100, completenessScore)),
    foundSections: foundSections.length,
    totalSections: sections.length,
    missingSections: expectedSections.filter(
      (expected) => !sections.some((section) => section.type.includes(expected))
    ),
  };
}

function calculatePromptCoverageScore(analysis) {
  const { promptCoverage, answerability, completeness } = analysis;

  // Calculate coverage percentage
  const totalWeight = Object.values(getCommonPrompts()).reduce(
    (sum, prompt) => sum + prompt.weight,
    0
  );
  const coveredWeight = Object.values(promptCoverage.matches).reduce(
    (sum, match) => sum + match.weight,
    0
  );
  const coveragePercentage = (coveredWeight / totalWeight) * 100;

  // Weighted average of all factors
  const finalScore =
    coveragePercentage * 0.5 +
    answerability.score * 0.3 +
    completeness.score * 0.2;

  return Math.round(finalScore);
}

function identifyPromptIssues(analysis) {
  const issues = [];

  if (analysis.promptCoverage.missing.length > 3) {
    issues.push({
      type: "Poor Prompt Coverage",
      description: "Content doesn't address many common question types",
      severity: "high",
    });
  }

  if (analysis.answerability.score < 50) {
    issues.push({
      type: "Low Answerability",
      description: "Content raises questions without providing clear answers",
      severity: "medium",
    });
  }

  if (analysis.completeness.score < 60) {
    issues.push({
      type: "Incomplete Coverage",
      description: "Content lacks comprehensive coverage of the topic",
      severity: "medium",
    });
  }

  if (
    analysis.answerability.questionCount >
    analysis.answerability.answerCount * 2
  ) {
    issues.push({
      type: "Too Many Unanswered Questions",
      description: "Content poses more questions than it answers",
      severity: "low",
    });
  }

  return issues;
}

function generatePromptRecommendations(analysis) {
  const recommendations = [];

  // Address missing prompt types
  const highValueMissing = analysis.promptCoverage.missing.filter(
    (missing) => missing.weight > 0.15
  );
  if (highValueMissing.length > 0) {
    recommendations.push({
      title: "Add Missing Question Types",
      description: `Address ${highValueMissing
        .map((m) => m.type)
        .join(", ")} questions`,
      expectedImprovement: 20,
    });
  }

  if (analysis.answerability.score < 70) {
    recommendations.push({
      title: "Improve Answer Clarity",
      description: "Provide clearer, more direct answers to implied questions",
      expectedImprovement: 15,
    });
  }

  if (analysis.completeness.missingSections.length > 0) {
    recommendations.push({
      title: "Add Missing Sections",
      description: `Include ${analysis.completeness.missingSections.join(
        ", "
      )} sections`,
      expectedImprovement: 12,
    });
  }

  // Specific recommendations based on missing prompt types
  analysis.promptCoverage.missing.forEach((missing) => {
    if (missing.type === "How to" && missing.weight > 0.2) {
      recommendations.push({
        title: "Add Step-by-Step Instructions",
        description: "Include practical how-to guidance",
        expectedImprovement: 18,
      });
    }

    if (missing.type === "Examples" && missing.weight > 0.1) {
      recommendations.push({
        title: "Include More Examples",
        description: "Add concrete examples and use cases",
        expectedImprovement: 10,
      });
    }
  });

  return recommendations;
}

// Helper functions
function identifyContentSections(text) {
  const lines = text.split("\n").filter((line) => line.trim());
  const sections = [];

  lines.forEach((line) => {
    const trimmed = line.trim().toLowerCase();

    if (isHeader(line)) {
      let type = "general";

      if (/intro|overview|background/.test(trimmed)) type = "introduction";
      else if (/definition|what is|meaning/.test(trimmed)) type = "definition";
      else if (/how|process|steps|method/.test(trimmed)) type = "explanation";
      else if (/example|instance|case|sample/.test(trimmed)) type = "examples";
      else if (/conclusion|summary|final/.test(trimmed)) type = "conclusion";

      sections.push({ text: line.trim(), type });
    }
  });

  return sections;
}

function isHeader(line) {
  const trimmed = line.trim();
  return (
    /^#{1,6}\s+/.test(trimmed) || // Markdown headers
    /^[A-Z][^.!?]*:?\s*$/.test(trimmed) || // All caps
    /^\d+\.?\s+[A-Z]/.test(trimmed) || // Numbered
    /^[IVX]+\.?\s+[A-Z]/.test(trimmed)
  ); // Roman numerals
}

function hasGoodStructure(text) {
  const lines = text.split("\n");
  const headers = lines.filter((line) => isHeader(line.trim()));
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());

  return headers.length >= 3 && paragraphs.length >= 4;
}
