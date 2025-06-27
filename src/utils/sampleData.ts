// Search-Ready AI Analyzer - Sample Data Export
// This file contains all hardcoded data used throughout the application

export interface ContentGap {
  id: string;
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  urgency: "Critical" | "High" | "Medium";
  failedPrompts: number;
  failureRate: number;
  promptVolume: number;
  timeToFixWeeks: number;
  complianceRisk: boolean;
  primaryAudience: string;
  actionable: boolean;
  improvementPercentage: number;
  gapType?: string;
  therapeuticArea?: string;
  urgencyScore?: number;
  businessImpact?: "High" | "Medium" | "Low";
  contentType?: string;
  estimatedEffort?: string;
  trend?: "increasing" | "stable" | "decreasing";
  relatedPrompts?: string[];
  recommendedActions?: string[];
  regulatoryImplications?: string[];
}

export interface MockContentChunk {
  id: string;
  title: string;
  content: string;
  category: string;
  confidence: number;
  source: string;
  lastUpdated: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  effort: "Low" | "Medium" | "High";
  category: "Structure" | "Content" | "Formatting" | "Style";
  hasRewrite?: boolean;
  originalText?: string;
  suggestedText?: string;
}

// ===========================================
// CONTENT GAPS DATA
// ===========================================

export const contentGapsData: ContentGap[] = [
  {
    id: "gap-1",
    title: "Drug Interaction Warnings Missing",
    description:
      "67% of combination therapy questions fail due to missing interaction data",
    impact: "High",
    urgency: "Critical",
    failedPrompts: 5641, // 67% of 8,420 total volume
    failureRate: 0.67,
    promptVolume: 8420,
    timeToFixWeeks: 3,
    complianceRisk: true,
    primaryAudience: "Healthcare Providers",
    actionable: true,
    improvementPercentage: 85,
    gapType: "Safety Information",
    therapeuticArea: "Cardiology",
    urgencyScore: 94,
    businessImpact: "High",
    contentType: "Safety Documentation",
    estimatedEffort: "4-6 weeks",
    trend: "increasing",
    relatedPrompts: [
      "Can [drug A] be taken with [drug B]?",
      "What are contraindications for [combination]?",
      "Monitoring parameters for dual therapy",
    ],
    recommendedActions: [
      "Create comprehensive interaction matrix",
      "Develop patient counseling materials",
      "Update prescribing information",
    ],
    regulatoryImplications: [
      "FDA labeling update required",
      "MLR review mandatory",
    ],
  },
  {
    id: "gap-2",
    title: "Pediatric Dosing Guidelines",
    description: "78% failure rate for under-18 dosing questions",
    impact: "High",
    urgency: "High",
    failedPrompts: 4859, // 78% of 6,230 total volume
    failureRate: 0.78,
    promptVolume: 6230,
    timeToFixWeeks: 5,
    complianceRisk: true,
    primaryAudience: "Pediatric Specialists",
    actionable: true,
    improvementPercentage: 78,
    gapType: "Dosing Guidelines",
    therapeuticArea: "Oncology",
    urgencyScore: 89,
    businessImpact: "High",
    contentType: "Clinical Guidelines",
    estimatedEffort: "6-8 weeks",
    trend: "increasing",
    relatedPrompts: [
      "Pediatric dosing for [medication]",
      "Safety in children under 12",
      "Weight-based dosing calculations",
    ],
    recommendedActions: [
      "Collaborate with pediatric specialists",
      "Develop dosing calculators",
      "Create age-appropriate materials",
    ],
    regulatoryImplications: [
      "Pediatric study data review",
      "Label expansion needed",
    ],
  },
  {
    id: "gap-3",
    title: "Lifestyle Modification Content",
    description: "45% of patient education prompts need diet/exercise guidance",
    impact: "Medium",
    urgency: "Medium",
    failedPrompts: 2556, // 45% of 5,680 total volume
    failureRate: 0.45,
    promptVolume: 5680,
    timeToFixWeeks: 2,
    complianceRisk: false,
    primaryAudience: "Patients & Caregivers",
    actionable: true,
    improvementPercentage: 45,
    gapType: "Patient Education",
    therapeuticArea: "Diabetes",
    urgencyScore: 76,
    businessImpact: "Medium",
    contentType: "Educational Materials",
    estimatedEffort: "3-4 weeks",
    trend: "stable",
    relatedPrompts: [
      "Diet recommendations with [medication]",
      "Exercise guidelines for [condition]",
      "Lifestyle changes to improve outcomes",
    ],
    recommendedActions: [
      "Partner with nutrition experts",
      "Create multimedia content",
      "Develop mobile-friendly resources",
    ],
    regulatoryImplications: [
      "Medical review required",
      "Claims substantiation",
    ],
  },
  {
    id: "gap-4",
    title: "Head-to-Head Study Results",
    description: "82% failure rate for competitive comparison requests",
    impact: "High",
    urgency: "High",
    failedPrompts: 4034, // 82% of 4,920 total volume
    failureRate: 0.82,
    promptVolume: 4920,
    timeToFixWeeks: 8,
    complianceRisk: false,
    primaryAudience: "Healthcare Providers",
    actionable: true,
    improvementPercentage: 92,
    gapType: "Comparative Effectiveness",
    therapeuticArea: "Mental Health",
    urgencyScore: 85,
    businessImpact: "High",
    contentType: "Clinical Evidence",
    estimatedEffort: "8-12 weeks",
    trend: "increasing",
    relatedPrompts: [
      "How does [our drug] compare to [competitor]?",
      "Efficacy comparison studies",
      "Comparative effectiveness analysis",
    ],
    recommendedActions: [
      "Conduct systematic literature review",
      "Develop evidence summaries",
      "Create comparison matrices",
    ],
    regulatoryImplications: ["Fair balance required", "Substantiation needed"],
  },
  {
    id: "gap-5",
    title: "Long-term Safety Monitoring",
    description: "71% failure rate for long-term safety monitoring questions",
    impact: "High",
    urgency: "High",
    failedPrompts: 2726, // 71% of 3,840 total volume
    failureRate: 0.71,
    promptVolume: 3840,
    timeToFixWeeks: 6,
    complianceRisk: true,
    primaryAudience: "Healthcare Providers",
    actionable: true,
    improvementPercentage: 71,
    gapType: "Adverse Events",
    therapeuticArea: "Rare Diseases",
    urgencyScore: 82,
    businessImpact: "High",
    contentType: "Safety Monitoring",
    estimatedEffort: "5-7 weeks",
    trend: "stable",
    relatedPrompts: [
      "Long-term side effects of [drug]",
      "Monitoring schedule for [therapy]",
      "When to discontinue treatment",
    ],
    recommendedActions: [
      "Compile post-marketing data",
      "Create monitoring guidelines",
      "Develop physician resources",
    ],
    regulatoryImplications: [
      "Long-term safety update needed",
      "REMS consideration",
    ],
  },
];

// ===========================================
// MOCK CONTENT CHUNKS FOR PROMPT SIMULATOR
// ===========================================

export const mockContentChunks: MockContentChunk[] = [
  {
    id: "chunk-1",
    title: "FDA Approval and Indication",
    content:
      "Skyrizi (risankizumab-rzaa) is indicated for the treatment of moderate to severe plaque psoriasis in adults who are candidates for systemic therapy or phototherapy. The medication received FDA approval in April 2019 following successful Phase 3 clinical trials demonstrating superior efficacy compared to placebo and active comparators.",
    category: "regulatory",
    confidence: 0.95,
    source: "FDA Prescribing Information",
    lastUpdated: "2024-01-15",
  },
  {
    id: "chunk-2",
    title: "Dosing and Administration",
    content:
      "The recommended dose of Skyrizi is 150 mg administered by subcutaneous injection at weeks 0, 4, and every 12 weeks thereafter. Each 150 mg dose is given as two subcutaneous injections of 75 mg each. Patients may self-inject after proper training. Store in refrigerator at 36°F to 46°F (2°C to 8°C).",
    category: "dosing",
    confidence: 0.98,
    source: "Prescribing Information",
    lastUpdated: "2024-01-15",
  },
  {
    id: "chunk-3",
    title: "Training and Education Resources",
    content:
      "Comprehensive training materials are available for healthcare providers and patients, including injection technique videos, patient starter kits, and ongoing support programs. The manufacturer provides dedicated support specialists and educational webinars for optimal treatment outcomes.",
    category: "training",
    confidence: 0.87,
    source: "Patient Support Materials",
    lastUpdated: "2024-01-10",
  },
  {
    id: "chunk-4",
    title: "Contraindications and Warnings",
    content:
      "Skyrizi is contraindicated in patients with known hypersensitivity to risankizumab or any excipients. Increased risk of serious infections that may lead to hospitalization or death may occur. Patients should be evaluated for tuberculosis before treatment initiation.",
    category: "safety",
    confidence: 0.96,
    source: "Safety Information",
    lastUpdated: "2024-01-15",
  },
  {
    id: "chunk-5",
    title: "Insurance and Access Information",
    content:
      "Skyrizi is covered by most major insurance plans for approved indications. Patient assistance programs are available for eligible patients. Average copay with insurance is $10-50. Prior authorization may be required depending on insurance provider.",
    category: "access",
    confidence: 0.82,
    source: "Access Resources",
    lastUpdated: "2024-01-12",
  },
];

// ===========================================
// ACTIONABLE INSIGHTS DATA
// ===========================================

export const defaultInsights: Insight[] = [
  {
    id: "1",
    title: "Add headings to Section 4",
    description:
      "Document lacks clear section headers, making it difficult for AI to understand content hierarchy and context.",
    impact: "High",
    effort: "Low",
    category: "Structure",
    hasRewrite: true,
    originalText:
      "The medication should be stored properly and administered according to guidelines. Patients need to understand the injection process and follow safety protocols.",
    suggestedText:
      "## Storage and Administration Guidelines\n\n### Proper Storage\nThe medication should be stored properly according to guidelines.\n\n### Patient Administration\nPatients need to understand the injection process and follow safety protocols.",
  },
  {
    id: "2",
    title: "Split paragraph 2.2 — it's too long for AI chunking",
    description:
      "Large text blocks reduce AI comprehension and retrieval accuracy. Break into smaller, focused chunks.",
    impact: "Medium",
    effort: "Low",
    category: "Formatting",
    hasRewrite: true,
    originalText:
      "This comprehensive treatment approach involves multiple considerations including patient selection criteria, dosing schedules, monitoring parameters, potential adverse events, drug interactions, contraindications, special populations, and long-term safety data that healthcare providers must carefully evaluate before prescribing this medication to ensure optimal patient outcomes and safety.",
    suggestedText:
      "This comprehensive treatment approach involves multiple considerations:\n\n• Patient selection criteria\n• Dosing schedules and timing\n• Required monitoring parameters\n• Potential adverse events\n• Drug interactions\n• Contraindications\n• Special populations\n• Long-term safety data\n\nHealthcare providers must carefully evaluate these factors before prescribing to ensure optimal patient outcomes and safety.",
  },
  {
    id: "3",
    title: "Avoid passive phrasing in conclusion",
    description:
      "Active voice improves clarity and makes content more accessible to AI processing and user understanding.",
    impact: "Medium",
    effort: "Medium",
    category: "Style",
    hasRewrite: true,
    originalText:
      "The treatment should be considered by physicians when patients have been evaluated for contraindications and appropriate monitoring can be established.",
    suggestedText:
      "Physicians should consider this treatment when they evaluate patients for contraindications and establish appropriate monitoring protocols.",
  },
  {
    id: "4",
    title: "Add specific keywords for dosing information",
    description:
      'Include explicit keywords like "dosage", "administration", and "frequency" to improve AI search matching.',
    impact: "Medium",
    effort: "Low",
    category: "Content",
    hasRewrite: true,
    originalText: "Take one tablet by mouth twice daily.",
    suggestedText:
      "**Dosage and Administration:**\nTake one tablet by mouth twice daily.\n\n**Frequency:** Twice daily (every 12 hours)\n**Route:** Oral administration\n**Dosage form:** Tablet",
  },
  {
    id: "5",
    title: "Format contraindications as a bulleted list",
    description:
      "Structured lists improve AI parsing and make critical safety information more scannable for users.",
    impact: "High",
    effort: "Low",
    category: "Formatting",
  },
];

// ===========================================
// EXAMPLE PROMPTS FOR SIMULATOR
// ===========================================

export const examplePrompts = [
  "What is the recommended dosing schedule for Skyrizi?",
  "Are there any contraindications I should know about?",
  "How should patients store this medication?",
  "What training resources are available for injection technique?",
  "Does insurance typically cover this treatment?",
  "What are the most common side effects?",
  "Can this be used in pediatric patients?",
  "How does this compare to other biologics?",
];

// ===========================================
// PERFORMANCE METRICS
// ===========================================

export const performanceMetrics = {
  overallSuccessRate: {
    current: 32,
    target: 85,
    trend: "down" as const,
    description:
      "Overall platform success rate (100% - 68% failure rate from main analysis)",
  },
  averageTimeToFix: {
    current: 4.8,
    target: 3.0,
    trend: "stable" as const,
    description: "Average weeks to resolve content gaps",
  },
  criticalGapCount: {
    current: 2,
    target: 0,
    trend: "up" as const,
    description: "Number of gaps with Critical urgency",
  },
  totalFailedPrompts: 19816,
  totalPromptVolume: 29090,
  overallFailureRate: 68.1,
};

// ===========================================
// THERAPEUTIC AREAS
// ===========================================

export const therapeuticAreas = [
  "Cardiology",
  "Oncology",
  "Diabetes",
  "Mental Health",
  "Rare Diseases",
  "Dermatology",
  "Immunology",
  "Neurology",
];

// ===========================================
// CONTENT TYPES
// ===========================================

export const contentTypes = [
  "Safety Documentation",
  "Clinical Guidelines",
  "Educational Materials",
  "Clinical Evidence",
  "Safety Monitoring",
  "Prescribing Information",
  "Patient Support Materials",
  "Regulatory Information",
];

// ===========================================
// EXPORT FUNCTIONS
// ===========================================

export const generateDataExport = () => {
  const timestamp = new Date().toISOString();

  return `
SEARCH-READY AI ANALYZER - SAMPLE DATA EXPORT
==========================================
Generated: ${timestamp}

SUMMARY STATISTICS
------------------
Total Content Gaps: ${contentGapsData.length}
Total Failed Prompts/Month: ${performanceMetrics.totalFailedPrompts.toLocaleString()}
Overall Success Rate: ${performanceMetrics.overallSuccessRate.current}%
Total Mock Content Chunks: ${mockContentChunks.length}
Total Actionable Insights: ${defaultInsights.length}

CONTENT GAPS BREAKDOWN
---------------------
${contentGapsData
  .map(
    (gap, index) => `
${index + 1}. ${gap.title}
   ID: ${gap.id}
   Description: ${gap.description}
   Impact: ${gap.impact} | Urgency: ${gap.urgency}
   Failed Prompts: ${gap.failedPrompts.toLocaleString()}/month
   Failure Rate: ${(gap.failureRate * 100).toFixed(0)}%
   Prompt Volume: ${gap.promptVolume.toLocaleString()}
   Time to Fix: ${gap.timeToFixWeeks} weeks
   Compliance Risk: ${gap.complianceRisk ? "Yes" : "No"}
   Primary Audience: ${gap.primaryAudience}
   Therapeutic Area: ${gap.therapeuticArea || "N/A"}
   Content Type: ${gap.contentType || "N/A"}
   
   Related Prompts:
   ${
     gap.relatedPrompts?.map((prompt) => `   - "${prompt}"`).join("\n") ||
     "   - No related prompts specified"
   }
   
   Recommended Actions:
   ${
     gap.recommendedActions?.map((action) => `   - ${action}`).join("\n") ||
     "   - No actions specified"
   }
   
   Regulatory Implications:
   ${
     gap.regulatoryImplications
       ?.map((implication) => `   - ${implication}`)
       .join("\n") || "   - No regulatory implications specified"
   }
`
  )
  .join("\n")}

MOCK CONTENT CHUNKS
------------------
${mockContentChunks
  .map(
    (chunk, index) => `
${index + 1}. ${chunk.title}
   ID: ${chunk.id}
   Category: ${chunk.category}
   Confidence: ${(chunk.confidence * 100).toFixed(0)}%
   Source: ${chunk.source}
   Last Updated: ${chunk.lastUpdated}
   
   Content Preview:
   ${chunk.content.substring(0, 200)}${chunk.content.length > 200 ? "..." : ""}
`
  )
  .join("\n")}

ACTIONABLE INSIGHTS
------------------
${defaultInsights
  .map(
    (insight, index) => `
${index + 1}. ${insight.title}
   ID: ${insight.id}
   Category: ${insight.category}
   Impact: ${insight.impact} | Effort: ${insight.effort}
   Description: ${insight.description}
   Has Rewrite Example: ${insight.hasRewrite ? "Yes" : "No"}
   
   ${
     insight.originalText
       ? `Original Text: "${insight.originalText.substring(0, 100)}${
           insight.originalText.length > 100 ? "..." : ""
         }"`
       : ""
   }
   ${
     insight.suggestedText
       ? `Suggested Text: "${insight.suggestedText.substring(0, 100)}${
           insight.suggestedText.length > 100 ? "..." : ""
         }"`
       : ""
   }
`
  )
  .join("\n")}

EXAMPLE PROMPTS
--------------
${examplePrompts.map((prompt, index) => `${index + 1}. "${prompt}"`).join("\n")}

THERAPEUTIC AREAS
----------------
${therapeuticAreas.map((area, index) => `${index + 1}. ${area}`).join("\n")}

CONTENT TYPES
------------
${contentTypes.map((type, index) => `${index + 1}. ${type}`).join("\n")}

PERFORMANCE METRICS
------------------
Overall Success Rate: ${
    performanceMetrics.overallSuccessRate.current
  }% (Target: ${performanceMetrics.overallSuccessRate.target}%)
Average Time to Fix: ${
    performanceMetrics.averageTimeToFix.current
  } weeks (Target: ${performanceMetrics.averageTimeToFix.target} weeks)
Critical Gap Count: ${performanceMetrics.criticalGapCount.current} (Target: ${
    performanceMetrics.criticalGapCount.target
  })
Total Failed Prompts: ${performanceMetrics.totalFailedPrompts.toLocaleString()}/month
Total Prompt Volume: ${performanceMetrics.totalPromptVolume.toLocaleString()}/month
Overall Failure Rate: ${performanceMetrics.overallFailureRate.toFixed(1)}%

DATA USAGE NOTES
---------------
- All data in this export is sample/mock data for demonstration purposes
- Content gaps are based on hypothetical scenarios in pharmaceutical/healthcare
- Prompt volumes and failure rates are realistic but fictional
- Mock content chunks represent typical pharmaceutical product information
- Actionable insights demonstrate common content optimization recommendations
- Performance metrics show typical AI content analysis benchmarks

TECHNICAL SPECIFICATIONS
-----------------------
Data Format: TypeScript interfaces
Content Gap Properties: ${
    Object.keys(contentGapsData[0]).length
  } fields per record
Mock Content Properties: ${
    Object.keys(mockContentChunks[0]).length
  } fields per record
Insight Properties: ${Object.keys(defaultInsights[0]).length} fields per record
Export Generated: ${new Date().toLocaleString()}
Application: Search-Ready AI Analyzer v1.0
`.trim();
};

export default {
  contentGapsData,
  mockContentChunks,
  defaultInsights,
  examplePrompts,
  performanceMetrics,
  therapeuticAreas,
  contentTypes,
  generateDataExport,
};
