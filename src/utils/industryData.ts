// Search-Ready AI Analyzer - Industry-Specific Mock Data
// This file contains mock data tailored for different industries

import { ContentGap, MockContentChunk, Insight } from "./sampleData";

export interface IndustryData {
  id: string;
  name: string;
  description: string;
  icon: string;
  contentGaps: ContentGap[];
  mockContentChunks: MockContentChunk[];
  insights: Insight[];
  commonPrompts: string[];
  keyMetrics: {
    totalPrompts: number;
    successRate: number;
    criticalGaps: number;
    averageFixTime: number;
  };
}

// ===========================================
// LIFE SCIENCES
// ===========================================

const lifeSciencesData: IndustryData = {
  id: "life-sciences",
  name: "Life Sciences",
  description: "Pharmaceutical, biotech, and medical device companies",
  icon: "🧬",
  contentGaps: [
    {
      id: "ls-gap-1",
      title: "Drug Interaction Database Gaps",
      description:
        "65% of combination therapy questions fail due to incomplete interaction data",
      impact: "High",
      urgency: "Critical",
      failedPrompts: 4200,
      failureRate: 0.65,
      promptVolume: 6462,
      timeToFixWeeks: 4,
      complianceRisk: true,
      primaryAudience: "Healthcare Providers",
      actionable: true,
      improvementPercentage: 88,
      therapeuticArea: "Cardiology",
      contentType: "Safety Documentation",
    },
    {
      id: "ls-gap-2",
      title: "Pediatric Dosing Guidelines",
      description: "72% failure rate for age-specific dosing calculations",
      impact: "High",
      urgency: "High",
      failedPrompts: 3100,
      failureRate: 0.72,
      promptVolume: 4306,
      timeToFixWeeks: 6,
      complianceRisk: true,
      primaryAudience: "Pediatric Specialists",
      actionable: true,
      improvementPercentage: 75,
      therapeuticArea: "Pediatrics",
      contentType: "Clinical Guidelines",
    },
    {
      id: "ls-gap-3",
      title: "Adverse Event Reporting",
      description: "58% of safety monitoring questions lack detailed protocols",
      impact: "High",
      urgency: "Critical",
      failedPrompts: 2800,
      failureRate: 0.58,
      promptVolume: 4828,
      timeToFixWeeks: 3,
      complianceRisk: true,
      primaryAudience: "Clinical Research",
      actionable: true,
      improvementPercentage: 82,
      therapeuticArea: "Safety",
      contentType: "Safety Monitoring",
    },
  ],
  mockContentChunks: [
    {
      id: "ls-chunk-1",
      title: "Drug Interaction Matrix",
      content:
        "Contraindications for concurrent use with ACE inhibitors include potassium-sparing diuretics due to hyperkalemia risk. Monitor serum potassium levels weekly during initiation. Dose adjustments required for patients with CrCl <50 mL/min.",
      category: "drug-interactions",
      confidence: 0.96,
      source: "FDA Drug Interaction Database",
      lastUpdated: "2024-01-15",
    },
    {
      id: "ls-chunk-2",
      title: "Pediatric Dosing Calculator",
      content:
        "Weight-based dosing for children 2-17 years: 0.5 mg/kg/day divided BID. Maximum daily dose 40mg. For patients <20kg, use oral suspension. Adjust for renal impairment using Schwartz equation for pediatric GFR estimation.",
      category: "pediatric-dosing",
      confidence: 0.94,
      source: "Pediatric Dosing Guidelines",
      lastUpdated: "2024-01-12",
    },
    {
      id: "ls-chunk-3",
      title: "Adverse Event Documentation",
      content:
        "Grade 3+ hepatotoxicity requires immediate drug discontinuation and hepatology consultation. Monitor ALT/AST weekly for first month, then monthly. Rechallenge contraindicated if ALT >5x ULN or total bilirubin >2x ULN.",
      category: "safety-monitoring",
      confidence: 0.98,
      source: "Safety Monitoring Protocol",
      lastUpdated: "2024-01-10",
    },
  ],
  insights: [
    {
      id: "ls-insight-1",
      title: "Add structured drug interaction tables",
      description:
        "Convert narrative interaction text into searchable tables with severity ratings",
      impact: "High",
      effort: "Medium",
      category: "Structure",
      hasRewrite: true,
      originalText:
        "This drug may interact with blood thinners and cause bleeding problems.",
      suggestedText:
        "**Drug Interactions - Severity: Major**\n\n| Interacting Drug Class | Risk | Monitoring Required |\n|---|---|---|\n| Anticoagulants (warfarin, heparin) | Increased bleeding risk | INR monitoring weekly |\n| Antiplatelet agents (aspirin, clopidogrel) | Enhanced anticoagulation | CBC with platelets q72h |",
    },
    {
      id: "ls-insight-2",
      title: "Include dosing calculation examples",
      description:
        "Add step-by-step calculation examples for complex dosing scenarios",
      impact: "High",
      effort: "Low",
      category: "Content",
    },
  ],
  commonPrompts: [
    "What are the drug interactions for [medication]?",
    "How do I dose this medication in pediatric patients?",
    "What adverse events should I monitor for?",
    "Are there any contraindications I should know about?",
    "What's the mechanism of action?",
    "How does this compare to other treatments in class?",
  ],
  keyMetrics: {
    totalPrompts: 15596,
    successRate: 34,
    criticalGaps: 2,
    averageFixTime: 4.3,
  },
};

// ===========================================
// RETAIL & E-COMMERCE
// ===========================================

const retailData: IndustryData = {
  id: "retail-ecommerce",
  name: "Retail & E-Commerce",
  description: "Online stores, marketplaces, and retail platforms",
  icon: "🛒",
  contentGaps: [
    {
      id: "retail-gap-1",
      title: "Product Specification Completeness",
      description:
        "43% of product queries fail due to missing technical specifications",
      impact: "Medium",
      urgency: "High",
      failedPrompts: 5600,
      failureRate: 0.43,
      promptVolume: 13023,
      timeToFixWeeks: 2,
      complianceRisk: false,
      primaryAudience: "Customers",
      actionable: true,
      improvementPercentage: 65,
      contentType: "Product Information",
    },
    {
      id: "retail-gap-2",
      title: "Size and Fit Guidance",
      description: "67% of sizing questions result in poor recommendations",
      impact: "High",
      urgency: "Medium",
      failedPrompts: 4200,
      failureRate: 0.67,
      promptVolume: 6269,
      timeToFixWeeks: 3,
      complianceRisk: false,
      primaryAudience: "Online Shoppers",
      actionable: true,
      improvementPercentage: 58,
      contentType: "Sizing Information",
    },
    {
      id: "retail-gap-3",
      title: "Return and Exchange Policies",
      description: "52% of policy questions receive inconsistent answers",
      impact: "Medium",
      urgency: "Medium",
      failedPrompts: 3100,
      failureRate: 0.52,
      promptVolume: 5962,
      timeToFixWeeks: 1,
      complianceRisk: false,
      primaryAudience: "Customer Service",
      actionable: true,
      improvementPercentage: 72,
      contentType: "Policy Documentation",
    },
  ],
  mockContentChunks: [
    {
      id: "retail-chunk-1",
      title: "Product Specifications - Wireless Headphones",
      content:
        "Sony WH-1000XM5: Frequency response 4Hz-40kHz, 30hr battery life with ANC on, USB-C charging, Bluetooth 5.2, weight 250g, foldable design with carrying case included. Compatible with Sony Headphones Connect app for EQ customization.",
      category: "product-specs",
      confidence: 0.91,
      source: "Product Catalog",
      lastUpdated: "2024-01-14",
    },
    {
      id: "retail-chunk-2",
      title: "Size Guide - Women's Jeans",
      content:
        'Size 8: Waist 29-30", Hip 39-40", Inseam 32". For between sizes, size up for comfort fit or down for snug fit. Premium denim has 2% stretch. Wash cold, hang dry to prevent shrinkage. Model is 5\'7" wearing size 8.',
      category: "sizing",
      confidence: 0.88,
      source: "Size Chart Database",
      lastUpdated: "2024-01-13",
    },
    {
      id: "retail-chunk-3",
      title: "Return Policy - Electronics",
      content:
        "Electronics may be returned within 30 days of purchase with original packaging and all accessories. Items must be in original condition. Restocking fee applies to opened software. Free return shipping for defective items only.",
      category: "return-policy",
      confidence: 0.95,
      source: "Customer Service Manual",
      lastUpdated: "2024-01-15",
    },
  ],
  insights: [
    {
      id: "retail-insight-1",
      title: "Standardize product attribute formats",
      description:
        "Create consistent templates for product specifications across all categories",
      impact: "High",
      effort: "Medium",
      category: "Structure",
    },
    {
      id: "retail-insight-2",
      title: "Add comparative sizing information",
      description:
        "Include size comparisons with popular brands for better fit guidance",
      impact: "Medium",
      effort: "Low",
      category: "Content",
    },
  ],
  commonPrompts: [
    "What are the dimensions of this product?",
    "How does the sizing run for this brand?",
    "What's your return policy?",
    "Is this product compatible with [other product]?",
    "What colors is this available in?",
    "How long does shipping take?",
  ],
  keyMetrics: {
    totalPrompts: 25254,
    successRate: 38,
    criticalGaps: 0,
    averageFixTime: 2.0,
  },
};

// ===========================================
// LEGAL
// ===========================================

const legalData: IndustryData = {
  id: "legal",
  name: "Legal",
  description: "Law firms, legal departments, and compliance organizations",
  icon: "⚖️",
  contentGaps: [
    {
      id: "legal-gap-1",
      title: "Jurisdiction-Specific Regulations",
      description:
        "74% of regulatory queries fail due to outdated or missing jurisdiction data",
      impact: "High",
      urgency: "Critical",
      failedPrompts: 3800,
      failureRate: 0.74,
      promptVolume: 5135,
      timeToFixWeeks: 8,
      complianceRisk: true,
      primaryAudience: "Legal Professionals",
      actionable: true,
      improvementPercentage: 89,
      contentType: "Regulatory Information",
    },
    {
      id: "legal-gap-2",
      title: "Case Law Precedent Analysis",
      description:
        "61% of precedent searches return incomplete or outdated citations",
      impact: "High",
      urgency: "High",
      failedPrompts: 2900,
      failureRate: 0.61,
      promptVolume: 4754,
      timeToFixWeeks: 6,
      complianceRisk: true,
      primaryAudience: "Attorneys",
      actionable: true,
      improvementPercentage: 78,
      contentType: "Case Law Database",
    },
  ],
  mockContentChunks: [
    {
      id: "legal-chunk-1",
      title: "GDPR Compliance Requirements",
      content:
        "Under Article 17 of GDPR, individuals have the right to erasure ('right to be forgotten') when personal data is no longer necessary for the original purpose. Organizations must respond within 30 days and provide verification of deletion. Exceptions apply for freedom of expression and public interest.",
      category: "data-privacy",
      confidence: 0.97,
      source: "GDPR Regulation Text",
      lastUpdated: "2024-01-15",
    },
    {
      id: "legal-chunk-2",
      title: "Employment Contract Provisions",
      content:
        "Non-compete clauses must be reasonable in scope, duration, and geographic limitation. California prohibits non-compete agreements entirely. In other states, clauses exceeding 2 years or restricting common industry practices may be unenforceable.",
      category: "employment-law",
      confidence: 0.93,
      source: "Employment Law Database",
      lastUpdated: "2024-01-12",
    },
  ],
  insights: [
    {
      id: "legal-insight-1",
      title: "Add jurisdiction tags to all regulations",
      description:
        "Tag content with specific jurisdictions and effective dates for accurate retrieval",
      impact: "High",
      effort: "Medium",
      category: "Structure",
    },
  ],
  commonPrompts: [
    "What are the requirements for [regulation] in [state/country]?",
    "Are there recent case law changes for [legal area]?",
    "What are the penalties for non-compliance with [regulation]?",
    "How do I file [legal document] in [jurisdiction]?",
    "What's the statute of limitations for [claim type]?",
  ],
  keyMetrics: {
    totalPrompts: 9889,
    successRate: 28,
    criticalGaps: 3,
    averageFixTime: 7.0,
  },
};

// ===========================================
// TRAVEL & HOSPITALITY
// ===========================================

const travelData: IndustryData = {
  id: "travel-hospitality",
  name: "Travel & Hospitality",
  description: "Hotels, airlines, travel agencies, and booking platforms",
  icon: "✈️",
  contentGaps: [
    {
      id: "travel-gap-1",
      title: "Real-time Amenity Information",
      description:
        "56% of amenity queries fail due to outdated facility information",
      impact: "Medium",
      urgency: "Medium",
      failedPrompts: 4100,
      failureRate: 0.56,
      promptVolume: 7321,
      timeToFixWeeks: 2,
      complianceRisk: false,
      primaryAudience: "Travelers",
      actionable: true,
      improvementPercentage: 68,
      contentType: "Facility Information",
    },
    {
      id: "travel-gap-2",
      title: "Cancellation Policy Clarity",
      description:
        "48% of cancellation questions receive unclear or incorrect information",
      impact: "High",
      urgency: "High",
      failedPrompts: 3600,
      failureRate: 0.48,
      promptVolume: 7500,
      timeToFixWeeks: 1,
      complianceRisk: false,
      primaryAudience: "Booking Customers",
      actionable: true,
      improvementPercentage: 75,
      contentType: "Policy Documentation",
    },
  ],
  mockContentChunks: [
    {
      id: "travel-chunk-1",
      title: "Hotel Amenities - Downtown Location",
      content:
        "24/7 fitness center with Peloton bikes, rooftop pool open Apr-Oct 6am-11pm, business center with printing services, pet-friendly (50lb limit, $75 fee), valet parking $45/night, complimentary WiFi throughout property, concierge service 7am-10pm.",
      category: "amenities",
      confidence: 0.89,
      source: "Property Management System",
      lastUpdated: "2024-01-14",
    },
    {
      id: "travel-chunk-2",
      title: "Flight Cancellation Policy",
      content:
        "Flights cancelled within 24 hours of booking receive full refund. After 24 hours: Basic Economy non-refundable, Main Cabin $200 change fee + fare difference, First Class changes permitted without fee. Weather cancellations result in full refund or rebooking at no charge.",
      category: "cancellation-policy",
      confidence: 0.94,
      source: "Airline Policy Manual",
      lastUpdated: "2024-01-15",
    },
  ],
  insights: [
    {
      id: "travel-insight-1",
      title: "Create dynamic amenity status updates",
      description:
        "Link amenity information to real-time facility management systems",
      impact: "Medium",
      effort: "High",
      category: "Content",
    },
  ],
  commonPrompts: [
    "What amenities does this hotel have?",
    "What's the cancellation policy for my booking?",
    "Is the pool/gym open?",
    "What's included in my room rate?",
    "How far is the airport from the hotel?",
    "Are pets allowed?",
  ],
  keyMetrics: {
    totalPrompts: 14821,
    successRate: 42,
    criticalGaps: 0,
    averageFixTime: 1.5,
  },
};

// ===========================================
// TECHNOLOGY
// ===========================================

const technologyData: IndustryData = {
  id: "technology",
  name: "Technology",
  description: "Software companies, SaaS platforms, and tech startups",
  icon: "💻",
  contentGaps: [
    {
      id: "tech-gap-1",
      title: "API Documentation Completeness",
      description:
        "69% of developer queries fail due to incomplete API examples",
      impact: "High",
      urgency: "High",
      failedPrompts: 6200,
      failureRate: 0.69,
      promptVolume: 8986,
      timeToFixWeeks: 3,
      complianceRisk: false,
      primaryAudience: "Developers",
      actionable: true,
      improvementPercentage: 82,
      contentType: "Technical Documentation",
    },
    {
      id: "tech-gap-2",
      title: "Troubleshooting Procedures",
      description: "54% of support queries lack step-by-step resolution guides",
      impact: "Medium",
      urgency: "High",
      failedPrompts: 4800,
      failureRate: 0.54,
      promptVolume: 8889,
      timeToFixWeeks: 2,
      complianceRisk: false,
      primaryAudience: "Support Teams",
      actionable: true,
      improvementPercentage: 71,
      contentType: "Support Documentation",
    },
  ],
  mockContentChunks: [
    {
      id: "tech-chunk-1",
      title: "REST API Authentication",
      content:
        "Authentication via Bearer token in Authorization header. Token expires after 24 hours. Request new token via POST /auth/token with client_id and client_secret. Rate limit: 1000 requests/hour. Include 'Content-Type: application/json' in all requests.",
      category: "api-docs",
      confidence: 0.96,
      source: "Developer Documentation",
      lastUpdated: "2024-01-15",
    },
    {
      id: "tech-chunk-2",
      title: "Database Connection Issues",
      content:
        "Connection timeout errors: 1) Check firewall rules on port 5432, 2) Verify connection string format, 3) Test with telnet [host] 5432, 4) Check database server logs for authentication failures, 5) Restart connection pool if using pgbouncer.",
      category: "troubleshooting",
      confidence: 0.91,
      source: "Support Knowledge Base",
      lastUpdated: "2024-01-13",
    },
  ],
  insights: [
    {
      id: "tech-insight-1",
      title: "Add code examples to all API endpoints",
      description:
        "Include working code samples in multiple programming languages",
      impact: "High",
      effort: "Medium",
      category: "Content",
    },
  ],
  commonPrompts: [
    "How do I authenticate with your API?",
    "What's the rate limit for API calls?",
    "How do I troubleshoot connection errors?",
    "What programming languages do you support?",
    "Where can I find code examples?",
    "How do I integrate with [third-party service]?",
  ],
  keyMetrics: {
    totalPrompts: 17875,
    successRate: 35,
    criticalGaps: 1,
    averageFixTime: 2.5,
  },
};

// ===========================================
// GAMING
// ===========================================

const gamingData: IndustryData = {
  id: "gaming",
  name: "Gaming",
  description: "Game developers, gaming platforms, and esports organizations",
  icon: "🎮",
  contentGaps: [
    {
      id: "gaming-gap-1",
      title: "Game Mechanics Explanations",
      description:
        "58% of gameplay questions receive incomplete mechanic descriptions",
      impact: "Medium",
      urgency: "Medium",
      failedPrompts: 7200,
      failureRate: 0.58,
      promptVolume: 12414,
      timeToFixWeeks: 3,
      complianceRisk: false,
      primaryAudience: "Players",
      actionable: true,
      improvementPercentage: 65,
      contentType: "Game Documentation",
    },
    {
      id: "gaming-gap-2",
      title: "Platform-Specific Features",
      description:
        "72% of platform queries fail due to inconsistent feature documentation",
      impact: "Medium",
      urgency: "High",
      failedPrompts: 3600,
      failureRate: 0.72,
      promptVolume: 5000,
      timeToFixWeeks: 2,
      complianceRisk: false,
      primaryAudience: "Gamers",
      actionable: true,
      improvementPercentage: 68,
      contentType: "Platform Guides",
    },
  ],
  mockContentChunks: [
    {
      id: "gaming-chunk-1",
      title: "Combat System Mechanics",
      content:
        "Combo system requires precise timing within 0.5 second windows. Light attacks (Square) can be chained 3x max, heavy attacks (Triangle) have 1.2s cooldown. Perfect dodges (R1 + direction) activate slow-motion for 2 seconds. Stamina depletes with consecutive actions.",
      category: "game-mechanics",
      confidence: 0.89,
      source: "Game Design Document",
      lastUpdated: "2024-01-14",
    },
    {
      id: "gaming-chunk-2",
      title: "Cross-Platform Play Setup",
      content:
        "Cross-play available between PC, Xbox, and PlayStation. Link accounts via Epic Games launcher. Friend codes work across all platforms. Voice chat requires platform-specific party setup. Progress syncs automatically when using same Epic account.",
      category: "platform-features",
      confidence: 0.92,
      source: "Platform Documentation",
      lastUpdated: "2024-01-13",
    },
  ],
  insights: [
    {
      id: "gaming-insight-1",
      title: "Create visual mechanic guides",
      description:
        "Add video demonstrations and interactive tutorials for complex game mechanics",
      impact: "High",
      effort: "High",
      category: "Content",
    },
  ],
  commonPrompts: [
    "How does the combat system work?",
    "Can I play with friends on different platforms?",
    "What are the system requirements?",
    "How do I unlock [achievement/item]?",
    "Is there cross-progression between platforms?",
    "How do I report a bug or cheater?",
  ],
  keyMetrics: {
    totalPrompts: 17414,
    successRate: 41,
    criticalGaps: 0,
    averageFixTime: 2.5,
  },
};

// ===========================================
// INDUSTRY DATA EXPORT
// ===========================================

export const industryDataCollection: IndustryData[] = [
  lifeSciencesData,
  retailData,
  legalData,
  travelData,
  technologyData,
  gamingData,
];

// Additional industries for "More Industries" section
export const additionalIndustries = [
  "Manufacturing",
  "Education",
  "Healthcare",
  "Real Estate",
  "Automotive",
  "Energy & Utilities",
  "Agriculture",
  "Telecommunications",
  "Insurance",
  "Non-Profit",
];

export const getIndustryById = (id: string): IndustryData | undefined => {
  return industryDataCollection.find((industry) => industry.id === id);
};

export const getAllIndustryMetrics = () => {
  return industryDataCollection.map((industry) => ({
    name: industry.name,
    totalPrompts: industry.keyMetrics.totalPrompts,
    successRate: industry.keyMetrics.successRate,
    criticalGaps: industry.keyMetrics.criticalGaps,
    averageFixTime: industry.keyMetrics.averageFixTime,
  }));
};

export default industryDataCollection;
