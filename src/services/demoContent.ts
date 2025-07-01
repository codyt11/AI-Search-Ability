// Demo Content Service
// Provides sample content for AI readiness analysis demonstrations

export interface DemoAdvertisement {
  id: string;
  title: string;
  platform: string;
  industry: string;
  format: string;
  content: {
    headline: string;
    description: string;
    cta: string;
    body_text: string;
    keywords: string[];
    target_audience: string;
    pain_points: string[];
    benefits: string[];
  };
  visual: {
    image_url: string;
    alt_text: string;
    image_description: string;
    dimensions: string;
    file_size: string;
  };
  ai_optimization: {
    readability_score: number;
    keyword_density: number;
    semantic_relevance: number;
    query_coverage: string[];
    optimization_opportunities: string[];
  };
  performance_metrics: {
    click_through_rate: number;
    conversion_rate: number;
    engagement_rate: number;
    ai_mention_frequency: number;
  };
}

export interface DemoLandingPage {
  id: string;
  title: string;
  url: string;
  industry: string;
  content_type: string;
  content: {
    main_headline: string;
    subheadline: string;
    hero_text: string;
    key_features: string[];
    social_proof: string;
    cta_primary: string;
    cta_secondary: string;
  };
  seo_optimization: {
    title_tag: string;
    meta_description: string;
    h1: string;
    target_keywords: string[];
  };
  visual_elements: {
    hero_image: string;
    hero_alt: string;
    feature_images?: Array<{ src: string; alt: string }>;
    testimonial_images?: Array<{ src: string; alt: string }>;
    product_images?: Array<{ src: string; alt: string }>;
  };
  ai_readiness_analysis: {
    structure_score: number;
    keyword_optimization: number;
    content_clarity: number;
    ai_query_coverage: number;
    conversion_optimization: number;
    strengths: string[];
    improvement_areas: string[];
    ai_discovery_potential: {
      query_matches: string[];
      content_gaps: string[];
    };
  };
}

export interface DemoImage {
  id: string;
  title: string;
  filename: string;
  image_url?: string;
  file_type: string;
  format: string;
  industry: string;
  content: {
    primary_text?: string;
    primary_subject?: string;
    extracted_text: string[];
    visual_elements: string[];
    brand_elements: string[];
  };
  ai_analysis: {
    ocr_confidence: number;
    text_extraction_quality: string;
    visual_composition_score: number;
    brand_recognition_accuracy: number;
    color_analysis: {
      dominant_colors: string[];
      color_harmony: string;
      brand_consistency: string;
    };
    composition_analysis: {
      focal_points: string[];
      visual_hierarchy: string;
      rule_of_thirds: string;
      white_space_usage: string;
    };
  };
  ai_optimization: {
    readability_score: number;
    semantic_relevance: number;
    query_coverage: string[];
    optimization_opportunities: string[];
  };
  visual_metrics: {
    dimensions: string;
    file_size: string;
    resolution: string;
    color_depth: string;
    compression_quality: string;
  };
  performance_data: {
    estimated_engagement: number;
    visual_appeal_score: number;
    message_clarity: number;
    call_to_action_prominence: number;
  };
}

export interface DemoContentLibrary {
  advertisements: DemoAdvertisement[];
  landing_pages: DemoLandingPage[];
  images: DemoImage[];
  content_categories: string[];
  demo_scenarios: Array<{
    name: string;
    description: string;
    key_metrics?: string[];
    focus_areas?: string[];
  }>;
}

class DemoContentService {
  private advertisements: DemoAdvertisement[] = [];
  private landingPages: DemoLandingPage[] = [];
  private images: DemoImage[] = [];
  private contentCategories: string[] = [];
  private demoScenarios: any[] = [];

  constructor() {
    // Always load fallback content first, then try to load from files
    this.loadFallbackContent();
    this.initializeDemoContent();
  }

  private async initializeDemoContent() {
    try {
      // Load advertisement data
      const adResponse = await fetch(
        "/demo-content/advertisements/social-media-ads.json"
      );
      if (adResponse.ok) {
        const adData = await adResponse.json();
        this.advertisements = adData.advertisements || [];
        this.contentCategories = [
          ...this.contentCategories,
          ...(adData.content_categories || []),
        ];
        this.demoScenarios = [
          ...this.demoScenarios,
          ...(adData.demo_scenarios || []),
        ];
      }

      // Load landing page data
      const lpResponse = await fetch(
        "/demo-content/web-content/landing-pages.json"
      );
      if (lpResponse.ok) {
        const lpData = await lpResponse.json();
        this.landingPages = lpData.landing_pages || [];
        this.contentCategories = [
          ...this.contentCategories,
          ...(lpData.optimization_categories || []),
        ];
        this.demoScenarios = [
          ...this.demoScenarios,
          ...(lpData.demo_use_cases || []),
        ];
      }

      // Load demo images data
      const imgResponse = await fetch("/demo-content/images/demo-images.json");
      if (imgResponse.ok) {
        const imgData = await imgResponse.json();
        this.images = imgData.demo_images || [];
        this.contentCategories = [
          ...this.contentCategories,
          ...(imgData.image_categories || []),
        ];
        this.demoScenarios = [
          ...this.demoScenarios,
          ...(imgData.demo_scenarios || []),
        ];
      }

      console.log("Demo content initialized:", {
        ads: this.advertisements.length,
        pages: this.landingPages.length,
        images: this.images.length,
      });
    } catch (error) {
      console.warn("Could not load demo content, using fallback data:", error);
      // Fallback content is already loaded in constructor
    }
  }

  private loadFallbackContent() {
    // Fallback demo content if JSON files aren't available
    this.advertisements = [
      {
        id: "demo_ad_001",
        title: "AI-Powered Marketing Tool",
        platform: "LinkedIn",
        industry: "Technology",
        format: "Single Image Ad",
        content: {
          headline: "Boost Marketing ROI by 300% with AI Analytics",
          description:
            "Transform your marketing campaigns with intelligent insights and automated optimization.",
          cta: "Start Free Trial",
          body_text:
            "Our AI marketing platform analyzes customer behavior, optimizes ad spend, and predicts campaign performance with 95% accuracy.",
          keywords: [
            "AI marketing",
            "marketing automation",
            "campaign optimization",
            "marketing analytics",
          ],
          target_audience: "Marketing managers, CMOs, digital marketers",
          pain_points: [
            "low ROI",
            "manual optimization",
            "data silos",
            "campaign inefficiency",
          ],
          benefits: [
            "300% ROI increase",
            "automated optimization",
            "unified analytics",
            "predictive insights",
          ],
        },
        visual: {
          image_url: "/demo-content/images/ai-marketing-dashboard.jpg",
          alt_text:
            "AI marketing dashboard showing campaign performance metrics and optimization recommendations",
          image_description:
            "Modern marketing analytics interface with charts, graphs, and AI-powered insights",
          dimensions: "1200x628",
          file_size: "267KB",
        },
        ai_optimization: {
          readability_score: 89,
          keyword_density: 2.5,
          semantic_relevance: 92,
          query_coverage: [
            "best AI marketing tools 2024",
            "marketing automation platform",
            "AI-powered campaign optimization",
          ],
          optimization_opportunities: [
            "Add customer testimonials",
            "Include specific use cases",
            "Enhance mobile messaging",
          ],
        },
        performance_metrics: {
          click_through_rate: 3.8,
          conversion_rate: 15.2,
          engagement_rate: 9.1,
          ai_mention_frequency: 18,
        },
      },
    ];

    this.landingPages = [
      {
        id: "demo_lp_001",
        title: "SaaS Product Landing Page",
        url: "https://example.com/saas-product",
        industry: "Software",
        content_type: "Product Landing Page",
        content: {
          main_headline: "Streamline Your Workflow with Smart Automation",
          subheadline:
            "Boost productivity by 40% with our intelligent task management platform",
          hero_text:
            "Join thousands of teams who've revolutionized their workflow with our AI-powered productivity suite.",
          key_features: [
            "Intelligent task prioritization",
            "Automated workflow optimization",
            "Real-time collaboration tools",
            "Advanced analytics dashboard",
          ],
          social_proof: "Trusted by 10,000+ teams worldwide",
          cta_primary: "Start Free Trial",
          cta_secondary: "Watch Demo",
        },
        seo_optimization: {
          title_tag:
            "Smart Workflow Automation | Boost Productivity 40% | ProductSuite",
          meta_description:
            "Streamline workflows with AI-powered automation. Increase team productivity by 40%. Free trial available.",
          h1: "Smart Workflow Automation That Actually Works",
          target_keywords: [
            "workflow automation",
            "productivity software",
            "task management",
            "team collaboration",
          ],
        },
        visual_elements: {
          hero_image: "/demo-content/images/workflow-dashboard.jpg",
          hero_alt:
            "Modern workflow automation dashboard showing task management and team collaboration features",
        },
        ai_readiness_analysis: {
          structure_score: 91,
          keyword_optimization: 87,
          content_clarity: 94,
          ai_query_coverage: 83,
          conversion_optimization: 89,
          strengths: [
            "Clear value proposition",
            "Strong benefit statements",
            "Good keyword coverage",
            "Compelling social proof",
          ],
          improvement_areas: [
            "Add FAQ section",
            "Include pricing information",
            "Enhance mobile optimization",
            "Add video testimonials",
          ],
          ai_discovery_potential: {
            query_matches: [
              "best workflow automation software",
              "team productivity tools 2024",
              "AI task management platform",
            ],
            content_gaps: [
              "Pricing details",
              "Integration capabilities",
              "Security features",
              "Customer support options",
            ],
          },
        },
      },
    ];

    this.images = [
      {
        id: "demo_img_001",
        title: "Pharmaceutical Advertisement",
        filename: "loramin.jpg",
        image_url: "/demo-content/images/loramin.jpg",
        file_type: "JPG",
        format: "Advertisement",
        industry: "Pharmaceutical",
        content: {
          primary_text: "Advanced Pharmaceutical Treatment",
          extracted_text: [
            "Prescription Medication",
            "Clinically Proven",
            "FDA Approved",
            "Professional Use Only",
          ],
          visual_elements: [
            "Medical imagery",
            "Pharmaceutical styling",
            "Professional healthcare photography",
          ],
          brand_elements: [
            "Pharmaceutical branding",
            "Medical certification",
            "Regulatory compliance",
          ],
        },
        ai_analysis: {
          ocr_confidence: 92,
          text_extraction_quality: "Excellent",
          visual_composition_score: 88,
          brand_recognition_accuracy: 94,
          color_analysis: {
            dominant_colors: ["#2E5BBA", "#FFFFFF", "#90EE90"],
            color_harmony: "Professional health-focused palette",
            brand_consistency: "Strong brand alignment",
          },
          composition_analysis: {
            focal_points: ["Product", "Headline", "Call-to-action"],
            visual_hierarchy: "Well-structured",
            rule_of_thirds: "Applied effectively",
            white_space_usage: "Balanced",
          },
        },
        ai_optimization: {
          readability_score: 86,
          semantic_relevance: 91,
          query_coverage: [
            "prescription medication",
            "pharmaceutical treatment",
            "medical therapy",
          ],
          optimization_opportunities: [
            "Add clinical trial data",
            "Include safety information",
            "Enhance regulatory compliance",
          ],
        },
        visual_metrics: {
          dimensions: "1200x800",
          file_size: "450KB",
          resolution: "300 DPI",
          color_depth: "24-bit",
          compression_quality: "High",
        },
        performance_data: {
          estimated_engagement: 8.7,
          visual_appeal_score: 89,
          message_clarity: 85,
          call_to_action_prominence: 82,
        },
      },
    ];

    this.contentCategories = [
      "Social Media Advertising",
      "AI-Optimized Content",
      "Landing Page Optimization",
      "Visual Content Analysis",
      "Image Optimization",
    ];

    this.demoScenarios = [
      {
        name: "B2B SaaS Marketing",
        description: "Optimize content for software and technology products",
        key_metrics: ["conversion rates", "lead quality", "trial signups"],
      },
      {
        name: "E-commerce Product Pages",
        description: "Enhance product discoverability and purchase intent",
        focus_areas: [
          "product benefits",
          "customer reviews",
          "purchase decisions",
        ],
      },
      {
        name: "Content Marketing",
        description: "Improve blog and educational content for AI discovery",
        focus_areas: ["search intent", "topic authority", "engagement"],
      },
      {
        name: "Visual Content Analysis",
        description: "Analyze images for AI discoverability and engagement",
        focus_areas: [
          "OCR analysis",
          "visual composition",
          "brand consistency",
        ],
      },
    ];
  }

  // Public methods
  getAdvertisements(): DemoAdvertisement[] {
    return this.advertisements;
  }

  getLandingPages(): DemoLandingPage[] {
    return this.landingPages;
  }

  getContentCategories(): string[] {
    return [...new Set(this.contentCategories)];
  }

  getDemoScenarios(): any[] {
    return this.demoScenarios;
  }

  getAdvertisementById(id: string): DemoAdvertisement | undefined {
    return this.advertisements.find((ad) => ad.id === id);
  }

  getLandingPageById(id: string): DemoLandingPage | undefined {
    return this.landingPages.find((page) => page.id === id);
  }

  getImages(): DemoImage[] {
    return this.images;
  }

  getImageById(id: string): DemoImage | undefined {
    return this.images.find((img) => img.id === id);
  }

  getContentByIndustry(
    industry: string
  ): (DemoAdvertisement | DemoLandingPage | DemoImage)[] {
    const ads = this.advertisements.filter((ad) =>
      ad.industry.toLowerCase().includes(industry.toLowerCase())
    );
    const pages = this.landingPages.filter((page) =>
      page.industry.toLowerCase().includes(industry.toLowerCase())
    );
    const images = this.images.filter((img) =>
      img.industry.toLowerCase().includes(industry.toLowerCase())
    );
    return [...ads, ...pages, ...images];
  }

  getContentByPlatform(platform: string): DemoAdvertisement[] {
    return this.advertisements.filter((ad) =>
      ad.platform.toLowerCase().includes(platform.toLowerCase())
    );
  }

  // Analysis methods
  getAverageOptimizationScore(): number {
    const allContent = [
      ...this.advertisements,
      ...this.landingPages,
      ...this.images,
    ];
    if (allContent.length === 0) return 0;

    const totalScore = allContent.reduce((sum, content) => {
      if ("ai_optimization" in content) {
        return sum + content.ai_optimization.semantic_relevance;
      } else if ("ai_readiness_analysis" in content) {
        return sum + content.ai_readiness_analysis.ai_query_coverage;
      }
      return sum;
    }, 0);

    return Math.round(totalScore / allContent.length);
  }

  getTopPerformingContent(
    limit: number = 5
  ): (DemoAdvertisement | DemoLandingPage | DemoImage)[] {
    const allContent = [
      ...this.advertisements,
      ...this.landingPages,
      ...this.images,
    ];

    return allContent
      .sort((a, b) => {
        const scoreA =
          "performance_metrics" in a
            ? a.performance_metrics.conversion_rate
            : "performance_data" in a
            ? a.performance_data.estimated_engagement
            : "ai_readiness_analysis" in a
            ? a.ai_readiness_analysis.conversion_optimization
            : 0;
        const scoreB =
          "performance_metrics" in b
            ? b.performance_metrics.conversion_rate
            : "performance_data" in b
            ? b.performance_data.estimated_engagement
            : "ai_readiness_analysis" in b
            ? b.ai_readiness_analysis.conversion_optimization
            : 0;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  getOptimizationOpportunities(): string[] {
    const allOpportunities: string[] = [];

    this.advertisements.forEach((ad) => {
      allOpportunities.push(...ad.ai_optimization.optimization_opportunities);
    });

    this.landingPages.forEach((page) => {
      allOpportunities.push(...page.ai_readiness_analysis.improvement_areas);
    });

    this.images.forEach((img) => {
      allOpportunities.push(...img.ai_optimization.optimization_opportunities);
    });

    // Return unique opportunities sorted by frequency
    const opportunityCount = allOpportunities.reduce((acc, opp) => {
      acc[opp] = (acc[opp] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(opportunityCount)
      .sort(([, a], [, b]) => b - a)
      .map(([opp]) => opp)
      .slice(0, 10);
  }

  // New methods specific to image analysis
  getImagesByFormat(format: string): DemoImage[] {
    return this.images.filter((img) =>
      img.format.toLowerCase().includes(format.toLowerCase())
    );
  }

  getAverageVisualCompositionScore(): number {
    if (this.images.length === 0) return 0;
    const totalScore = this.images.reduce(
      (sum, img) => sum + img.ai_analysis.visual_composition_score,
      0
    );
    return Math.round(totalScore / this.images.length);
  }

  getTopVisualContent(limit: number = 3): DemoImage[] {
    return this.images
      .sort(
        (a, b) =>
          b.performance_data.visual_appeal_score -
          a.performance_data.visual_appeal_score
      )
      .slice(0, limit);
  }
}

// Export singleton instance
export const demoContentService = new DemoContentService();
export default demoContentService;
