import { useState } from "react";
import {
  Save,
  Key,
  Settings as SettingsIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    openaiApiKey: "",
    analysisDepth: "standard",
    autoSaveResults: true,
    emailNotifications: false,
    maxFileSize: 50,
    enableContentGapAnalysis: true,
    promptTrendAnalysis: true,
    customPrompts: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-2">
          Configure your Search-Ready AI Analyzer preferences and API settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* API Configuration */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-600/20">
                <Key className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                API Configuration
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={settings.openaiApiKey}
                  onChange={(e) =>
                    handleInputChange("openaiApiKey", e.target.value)
                  }
                  className="input-field"
                  placeholder="sk-..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Required for advanced text analysis and embedding generation
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Analysis Depth
                </label>
                <select
                  value={settings.analysisDepth}
                  onChange={(e) =>
                    handleInputChange("analysisDepth", e.target.value)
                  }
                  className="input-field"
                >
                  <option value="basic">
                    Basic - Structure and token analysis only
                  </option>
                  <option value="standard">
                    Standard - Include readability and basic AI metrics
                  </option>
                  <option value="comprehensive">
                    Comprehensive - Full analysis with AI insights
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Analysis Preferences */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-green-600/20">
                <SettingsIcon className="h-5 w-5 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Analysis Preferences
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors duration-200">
                <div>
                  <h3 className="font-medium text-white">Auto-save Results</h3>
                  <p className="text-sm text-gray-400">
                    Automatically save analysis results
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSaveResults}
                    onChange={(e) =>
                      handleInputChange("autoSaveResults", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors duration-200">
                <div>
                  <h3 className="font-medium text-white">
                    Content Gap Analysis
                  </h3>
                  <p className="text-sm text-gray-400">
                    Identify missing content based on prompt trends
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableContentGapAnalysis}
                    onChange={(e) =>
                      handleInputChange(
                        "enableContentGapAnalysis",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors duration-200">
                <div>
                  <h3 className="font-medium text-white">
                    Prompt Trend Analysis
                  </h3>
                  <p className="text-sm text-gray-400">
                    Analyze content against current prompt trends
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.promptTrendAnalysis}
                    onChange={(e) =>
                      handleInputChange("promptTrendAnalysis", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Maximum File Size (MB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxFileSize}
                  onChange={(e) =>
                    handleInputChange("maxFileSize", parseInt(e.target.value))
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Prompts for Analysis
                </label>
                <textarea
                  value={settings.customPrompts}
                  onChange={(e) =>
                    handleInputChange("customPrompts", e.target.value)
                  }
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Enter custom prompts separated by newlines to test content against specific use cases..."
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-purple-600/20">
                <AlertCircle className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors duration-200">
                <div>
                  <h3 className="font-medium text-white">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-400">
                    Receive analysis completion notifications
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      handleInputChange("emailNotifications", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="card p-6">
            <h3 className="font-bold text-white mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-white">
                    File Upload Service
                  </span>
                </div>
                <span className="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded-full">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-white">Analysis Engine</span>
                </div>
                <span className="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded-full">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
                <div className="flex items-center space-x-3">
                  {settings.openaiApiKey ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                  )}
                  <span className="text-sm text-white">OpenAI Integration</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    settings.openaiApiKey
                      ? "bg-green-900/30 text-green-300"
                      : "bg-yellow-900/30 text-yellow-300"
                  }`}
                >
                  {settings.openaiApiKey ? "Connected" : "Setup Required"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h3 className="font-bold text-white mb-4">Usage Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-700/30">
                <span className="text-gray-400 text-sm">
                  Analyses this month:
                </span>
                <span className="font-medium text-white">47</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-700/30">
                <span className="text-gray-400 text-sm">Storage used:</span>
                <span className="font-medium text-white">2.3 GB</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-700/30">
                <span className="text-gray-400 text-sm">
                  API calls remaining:
                </span>
                <span className="font-medium text-white">8,234</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
