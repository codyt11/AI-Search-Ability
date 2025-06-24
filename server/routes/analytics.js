import express from "express";

const router = express.Router();

// Mock analytics data (in production, this would come from a database)
const mockAnalyticsData = {
  totalAssets: 247,
  avgCompatibilityScore: 87,
  commonIssues: [
    { type: "Long Sentences", frequency: 34, impact: "Medium" },
    { type: "High Token Count", frequency: 28, impact: "High" },
    { type: "Missing Headers", frequency: 22, impact: "High" },
    { type: "Low Concept Density", frequency: 19, impact: "Medium" },
    { type: "Excessive Filler Words", frequency: 15, impact: "Low" },
  ],
  improvementTrends: [
    { month: "Jan", avgScore: 72, assetsAnalyzed: 18 },
    { month: "Feb", avgScore: 75, assetsAnalyzed: 22 },
    { month: "Mar", avgScore: 78, assetsAnalyzed: 28 },
    { month: "Apr", avgScore: 81, assetsAnalyzed: 32 },
    { month: "May", avgScore: 84, assetsAnalyzed: 35 },
    { month: "Jun", avgScore: 87, assetsAnalyzed: 41 },
  ],
  contentGapTrends: [
    { topic: "How-to Instructions", frequency: 32, priority: "High" },
    { topic: "Examples", frequency: 28, priority: "Medium" },
    { topic: "Benefits", frequency: 24, priority: "High" },
    { topic: "Troubleshooting", frequency: 19, priority: "Medium" },
    { topic: "Best Practices", frequency: 16, priority: "Medium" },
    { topic: "Comparisons", frequency: 12, priority: "Low" },
  ],
};

router.get("/analytics", (req, res) => {
  try {
    res.json(mockAnalyticsData);
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      error: "Failed to fetch analytics data",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

router.get("/analytics/trends", (req, res) => {
  try {
    const { timeframe = "6m" } = req.query;

    // Filter data based on timeframe
    let trends = mockAnalyticsData.improvementTrends;
    if (timeframe === "3m") {
      trends = trends.slice(-3);
    } else if (timeframe === "1y") {
      // Extend with more historical data for demo
      trends = [
        ...Array.from({ length: 6 }, (_, i) => ({
          month: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
          avgScore: 60 + i * 2,
          assetsAnalyzed: 8 + i * 2,
        })),
        ...trends,
      ];
    }

    res.json({ trends });
  } catch (error) {
    console.error("Trends analytics error:", error);
    res.status(500).json({
      error: "Failed to fetch trends data",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

router.get("/analytics/issues", (req, res) => {
  try {
    const { severity } = req.query;

    let issues = mockAnalyticsData.commonIssues;
    if (severity) {
      issues = issues.filter(
        (issue) => issue.impact.toLowerCase() === severity.toLowerCase()
      );
    }

    res.json({ issues });
  } catch (error) {
    console.error("Issues analytics error:", error);
    res.status(500).json({
      error: "Failed to fetch issues data",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

router.get("/analytics/content-gaps", (req, res) => {
  try {
    const { priority } = req.query;

    let gaps = mockAnalyticsData.contentGapTrends;
    if (priority) {
      gaps = gaps.filter(
        (gap) => gap.priority.toLowerCase() === priority.toLowerCase()
      );
    }

    res.json({ gaps });
  } catch (error) {
    console.error("Content gaps analytics error:", error);
    res.status(500).json({
      error: "Failed to fetch content gaps data",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

export default router;
