import { Link, useLocation } from "react-router-dom";
import {
  Brain,
  BarChart3,
  Settings,
  X,
  TrendingUp,
  AlertTriangle,
  Play,
  Database,
  Menu,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface FilterState {
  status: string[];
  priority: string[];
  contentType: string[];
  scoreRange: { min: number; max: number };
}

const Navbar = () => {
  const location = useLocation();
  const [timeRange, setTimeRange] = useState("Last 7 days");
  const [region, setRegion] = useState("All models");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    contentType: [],
    scoreRange: { min: 0, max: 100 },
  });
  const filterRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: "/", label: "Home", icon: Brain },
    { path: "/content-assets", label: "Content & Assets", icon: Database },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/prompt-trends", label: "Prompt Trends", icon: TrendingUp },
    { path: "/content-gaps", label: "Content Gaps", icon: AlertTriangle },
    { path: "/prompt-simulator", label: "Prompt Simulator", icon: Play },
  ];

  const timeRanges = [
    "Last 24 hours",
    "Last 7 days",
    "Last 30 days",
    "Custom range",
  ];
  const regions = [
    "All models",
    "GPT Models",
    "Claude Models",
    "Gemini Models",
  ];

  const filterOptions = {
    status: ["Active", "Pending", "Completed", "Failed"],
    priority: ["High", "Medium", "Low"],
    contentType: ["PDF", "HTML", "DOCX", "TXT", "Email"],
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (
    category: keyof Omit<FilterState, "scoreRange">,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [category]: (prev[category] as string[]).includes(value)
        ? (prev[category] as string[]).filter((item: string) => item !== value)
        : [...(prev[category] as string[]), value],
    }));
  };

  const handleScoreRangeChange = (type: "min" | "max", value: number) => {
    setFilters((prev) => ({
      ...prev,
      scoreRange: {
        ...prev.scoreRange,
        [type]: value,
      },
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      contentType: [],
      scoreRange: { min: 0, max: 100 },
    });
  };

  const getActiveFilterCount = () => {
    return (
      filters.status.length +
      filters.priority.length +
      filters.contentType.length +
      (filters.scoreRange.min > 0 || filters.scoreRange.max < 100 ? 1 : 0)
    );
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:inline">
              Search-Ready AI Analyzer
            </span>
            <span className="text-xl font-bold text-gradient sm:hidden">
              AI Analyzer
            </span>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={
                  location.pathname === path ? "nav-item-active" : "nav-item"
                }
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}

            {/* Time Range and Region Selectors */}
            <div className="flex items-center space-x-2 ml-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-2 py-2 pr-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer w-32"
              >
                {timeRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>

              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-2 py-2 pr-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer w-28"
              >
                {regions.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>

              {/* Settings Icon */}
              <Link
                to="/settings"
                className={`p-2 rounded-lg transition-colors ${
                  location.pathname === "/settings"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden ${
            isMobileMenuOpen ? "block" : "hidden"
          } pt-2 pb-4 border-t border-gray-700`}
        >
          <div className="space-y-2 px-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 p-3 rounded-lg ${
                  location.pathname === path
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}

            {/* Mobile Time Range and Region Selectors */}
            <div className="space-y-2 pt-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {timeRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>

              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {regions.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>

              {/* Mobile Settings Link */}
              <Link
                to="/settings"
                className={`flex items-center space-x-2 p-3 rounded-lg ${
                  location.pathname === "/settings"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
