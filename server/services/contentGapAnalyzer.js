export async function identifyContentGaps(text) {
  try {
    const topicAnalysis = analyzeMainTopics(text);
    const promptGaps = identifyPromptGaps(text, topicAnalysis);
    const contextualGaps = identifyContextualGaps(text);
    const informationGaps = identifyInformationGaps(text);

    const allGaps = [...promptGaps, ...contextualGaps, ...informationGaps].sort(
      (a, b) => (b.priority === "High" ? 1 : -1)
    );

    return {
      gaps: allGaps.slice(0, 10), // Top 10 gaps
      mainTopics: topicAnalysis.topics,
      coverageScore: calculateCoverageScore(allGaps),
      gapCount: allGaps.length,
    };
  } catch (error) {
    console.error("Content gap analysis error:", error);
    throw error;
  }
}

function analyzeMainTopics(text) {
  const words = text.toLowerCase().split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim());

  // Extract potential topics using simple keyword analysis
  const topicKeywords = extractTopicKeywords(words);
  const topics = identifyMainTopics(topicKeywords, sentences);

  return {
    topics: topics.slice(0, 5), // Top 5 topics
    keywordDensity: topicKeywords.length / words.length,
  };
}

function identifyPromptGaps(text, topicAnalysis) {
  const gaps = [];
  const lowerText = text.toLowerCase();

  // Common question patterns that users expect answers to
  const expectedQuestions = [
    {
      type: "Definition",
      patterns: ["what is", "what are", "definition"],
      description: "Clear definitions of key terms",
      priority: "High",
      queryFrequency: 85,
    },
    {
      type: "Benefits",
      patterns: ["benefit", "advantage", "why use"],
      description: "Benefits and advantages explanation",
      priority: "High",
      queryFrequency: 78,
    },
    {
      type: "How-to Instructions",
      patterns: ["how to", "step by step", "instructions"],
      description: "Step-by-step guidance and instructions",
      priority: "High",
      queryFrequency: 82,
    },
    {
      type: "Best Practices",
      patterns: ["best practice", "recommended", "should"],
      description: "Best practices and recommendations",
      priority: "Medium",
      queryFrequency: 65,
    },
    {
      type: "Troubleshooting",
      patterns: ["problem", "issue", "error", "troubleshoot"],
      description: "Common problems and solutions",
      priority: "Medium",
      queryFrequency: 71,
    },
    {
      type: "Examples",
      patterns: ["example", "for instance", "case study"],
      description: "Concrete examples and use cases",
      priority: "Medium",
      queryFrequency: 68,
    },
    {
      type: "Comparison",
      patterns: ["vs", "versus", "compare", "difference"],
      description: "Comparisons with alternatives",
      priority: "Low",
      queryFrequency: 45,
    },
    {
      type: "Pricing/Cost",
      patterns: ["cost", "price", "pricing", "expensive"],
      description: "Cost and pricing information",
      priority: "Medium",
      queryFrequency: 58,
    },
  ];

  expectedQuestions.forEach((question) => {
    const hasContent = question.patterns.some((pattern) =>
      lowerText.includes(pattern)
    );

    if (!hasContent) {
      gaps.push({
        topic: question.type,
        description: question.description,
        priority: question.priority,
        queryFrequency: question.queryFrequency,
        type: "prompt",
      });
    }
  });

  return gaps;
}

function identifyContextualGaps(text) {
  const gaps = [];
  const sections = identifyContentSections(text);

  // Check for missing contextual information
  const contextualElements = [
    {
      name: "Prerequisites",
      indicators: ["prerequisite", "requirement", "before", "needed"],
      description: "Prerequisites and requirements",
      priority: "Medium",
      queryFrequency: 62,
    },
    {
      name: "Getting Started",
      indicators: ["getting started", "begin", "first step", "setup"],
      description: "Getting started guidance",
      priority: "High",
      queryFrequency: 79,
    },
    {
      name: "Advanced Topics",
      indicators: ["advanced", "expert", "complex", "detailed"],
      description: "Advanced or detailed information",
      priority: "Low",
      queryFrequency: 38,
    },
    {
      name: "Related Topics",
      indicators: ["related", "see also", "similar", "connection"],
      description: "Related topics and cross-references",
      priority: "Low",
      queryFrequency: 42,
    },
    {
      name: "Updates/Changes",
      indicators: ["update", "change", "new", "recent", "version"],
      description: "Recent updates and changes",
      priority: "Medium",
      queryFrequency: 55,
    },
  ];

  const lowerText = text.toLowerCase();

  contextualElements.forEach((element) => {
    const hasElement = element.indicators.some((indicator) =>
      lowerText.includes(indicator)
    );

    if (!hasElement) {
      gaps.push({
        topic: element.name,
        description: element.description,
        priority: element.priority,
        queryFrequency: element.queryFrequency,
        type: "contextual",
      });
    }
  });

  return gaps;
}

function identifyInformationGaps(text) {
  const gaps = [];
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim());
  const words = text.split(/\s+/);

  // Analyze information density and completeness
  const avgSentenceLength = words.length / sentences.length;
  const hasDetails = text.includes("detail") || text.includes("specific");
  const hasNumbers = /\b\d+(\.\d+)?\b/.test(text);
  const hasLists =
    text.includes("•") || text.includes("-") || /\d+\./.test(text);

  // Common information gaps
  const informationGaps = [
    {
      condition: !hasNumbers,
      topic: "Quantitative Data",
      description: "Specific numbers, statistics, or measurements",
      priority: "Medium",
      queryFrequency: 63,
    },
    {
      condition: !hasDetails,
      topic: "Detailed Explanations",
      description: "More detailed explanations and specifications",
      priority: "Medium",
      queryFrequency: 67,
    },
    {
      condition: !hasLists,
      topic: "Structured Lists",
      description: "Organized lists and bullet points",
      priority: "Low",
      queryFrequency: 48,
    },
    {
      condition: avgSentenceLength < 15,
      topic: "Comprehensive Content",
      description: "More comprehensive and detailed content",
      priority: "Medium",
      queryFrequency: 59,
    },
    {
      condition: sentences.length < 10,
      topic: "Content Depth",
      description: "Deeper exploration of the topic",
      priority: "High",
      queryFrequency: 73,
    },
  ];

  informationGaps.forEach((gap) => {
    if (gap.condition) {
      gaps.push({
        topic: gap.topic,
        description: gap.description,
        priority: gap.priority,
        queryFrequency: gap.queryFrequency,
        type: "information",
      });
    }
  });

  return gaps;
}

function calculateCoverageScore(gaps) {
  if (gaps.length === 0) return 100;

  // Calculate score based on number and priority of gaps
  const highPriorityGaps = gaps.filter((gap) => gap.priority === "High").length;
  const mediumPriorityGaps = gaps.filter(
    (gap) => gap.priority === "Medium"
  ).length;
  const lowPriorityGaps = gaps.filter((gap) => gap.priority === "Low").length;

  const penalty =
    highPriorityGaps * 15 + mediumPriorityGaps * 8 + lowPriorityGaps * 3;

  return Math.max(0, 100 - penalty);
}

// Helper functions
function extractTopicKeywords(words) {
  const stopWords = new Set([
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

  return words
    .filter((word) => word.length > 3 && !stopWords.has(word))
    .map((word) => word.replace(/[^a-z]/g, ""))
    .filter((word) => word.length > 3);
}

function identifyMainTopics(keywords, sentences) {
  // Simple frequency-based topic extraction
  const frequency = {};
  keywords.forEach((keyword) => {
    frequency[keyword] = (frequency[keyword] || 0) + 1;
  });

  return Object.entries(frequency)
    .filter(([word, count]) => count > 1)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({
      word,
      frequency: count,
      relevance: Math.min(100, (count / keywords.length) * 1000),
    }));
}

function identifyContentSections(text) {
  const lines = text.split("\n").filter((line) => line.trim());
  const sections = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (isHeader(trimmed)) {
      sections.push({
        text: trimmed,
        type: categorizeSection(trimmed.toLowerCase()),
      });
    }
  });

  return sections;
}

function isHeader(line) {
  return (
    /^#{1,6}\s+/.test(line) || // Markdown headers
    /^[A-Z][^.!?]*:?\s*$/.test(line) || // All caps
    /^\d+\.?\s+[A-Z]/.test(line) || // Numbered
    /^[IVX]+\.?\s+[A-Z]/.test(line)
  ); // Roman numerals
}

function categorizeSection(headerText) {
  if (/intro|overview|about/.test(headerText)) return "introduction";
  if (/how|step|process|method/.test(headerText)) return "instructions";
  if (/example|case|sample/.test(headerText)) return "examples";
  if (/benefit|advantage|why/.test(headerText)) return "benefits";
  if (/problem|issue|trouble/.test(headerText)) return "troubleshooting";
  if (/conclusion|summary/.test(headerText)) return "conclusion";
  return "general";
}
