import { useState, useEffect } from "react";
import { Activity, Search, Clock, Zap } from "lucide-react";

interface PromptActivity {
  id: string;
  prompt: string;
  therapeuticArea: string;
  timestamp: Date;
  responseTime: number;
  status: "success" | "failed" | "pending";
}

const RealtimePromptMonitor = () => {
  const [activities, setActivities] = useState<PromptActivity[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Mock real-time prompt activity
  const generateMockActivity = (): PromptActivity => {
    const prompts = [
      "What are the contraindications for [drug]?",
      "Side effects of [medication] in elderly patients",
      "Drug interactions with [compound]",
      "Dosing for pediatric patients",
      "Clinical efficacy data for [treatment]",
      "Patient counseling points for [therapy]",
      "Mechanism of action of [drug]",
      "Monitoring parameters for [medication]",
    ];

    const therapeuticAreas = [
      "Oncology",
      "Cardiology",
      "Diabetes",
      "Mental Health",
      "Rare Diseases",
    ];

    const statuses: ("success" | "failed" | "pending")[] = [
      "success",
      "success",
      "success",
      "failed",
      "pending",
    ];

    return {
      id: Math.random().toString(36).substr(2, 9),
      prompt: prompts[Math.floor(Math.random() * prompts.length)],
      therapeuticArea:
        therapeuticAreas[Math.floor(Math.random() * therapeuticAreas.length)],
      timestamp: new Date(),
      responseTime: Math.random() * 4 + 0.5, // 0.5-4.5 seconds
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
  };

  useEffect(() => {
    if (!isLive) return;

    // Add initial activities
    const initialActivities = Array.from({ length: 8 }, generateMockActivity);
    setActivities(initialActivities);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newActivity = generateMockActivity();
      setActivities((prev) => [newActivity, ...prev.slice(0, 19)]); // Keep latest 20
    }, 2000 + Math.random() * 3000); // Random interval 2-5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-400";
      case "failed":
        return "text-red-400";
      case "pending":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✓";
      case "failed":
        return "✗";
      case "pending":
        return "⏳";
      default:
        return "?";
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">
            Real-time Prompt Activity
          </h3>
          {isLive && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">LIVE</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`text-sm px-3 py-1 rounded-lg transition-colors duration-200 ${
            isLive
              ? "bg-green-900/30 text-green-300 border border-green-700/50"
              : "bg-gray-700 text-gray-300 border border-gray-600"
          }`}
        >
          {isLive ? "Pause" : "Resume"}
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200 animate-slide-up"
          >
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                activity.status === "success"
                  ? "bg-green-900/30"
                  : activity.status === "failed"
                  ? "bg-red-900/30"
                  : "bg-yellow-900/30"
              }`}
            >
              <span className={getStatusColor(activity.status)}>
                {getStatusIcon(activity.status)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white truncate">
                  {activity.prompt}
                </p>
                <span className="text-xs text-gray-400 ml-2">
                  {activity.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                <span className="flex items-center space-x-1">
                  <Search className="h-3 w-3" />
                  <span>{activity.therapeuticArea}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{activity.responseTime.toFixed(1)}s</span>
                </span>
                <span
                  className={`flex items-center space-x-1 ${getStatusColor(
                    activity.status
                  )}`}
                >
                  <Zap className="h-3 w-3" />
                  <span className="capitalize">{activity.status}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No prompt activity yet...</p>
          <p className="text-xs mt-1">Click Resume to start monitoring</p>
        </div>
      )}
    </div>
  );
};

export default RealtimePromptMonitor;
