import { Link, useLocation } from "react-router-dom";
import {
  Brain,
  FileText,
  BarChart3,
  Settings,
  Filter,
  ChevronDown,
  X,
  TrendingUp,
  AlertTriangle,
  Play,
  Database,
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
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">
              Search-Ready AI Analyzer
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
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
          </div>

          {/* Time Range and Filters */}
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <div className="relative">
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
            </div>

            {/* Region/Model Selector */}
            <div className="relative">
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
            </div>

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

            {/* Filter Button with Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-2 py-2 hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center space-x-1 relative"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {getActiveFilterCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Filter Dropdown */}
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        Filters
                      </h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
                    {/* Status Filter */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Status
                      </h4>
                      <div className="space-y-2">
                        {filterOptions.status.map((status) => (
                          <label
                            key={status}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={filters.status.includes(status)}
                              onChange={() =>
                                handleFilterChange("status", status)
                              }
                              className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-300">
                              {status}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Priority Filter */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Priority
                      </h4>
                      <div className="space-y-2">
                        {filterOptions.priority.map((priority) => (
                          <label
                            key={priority}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={filters.priority.includes(priority)}
                              onChange={() =>
                                handleFilterChange("priority", priority)
                              }
                              className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-300">
                              {priority}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Content Type Filter */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Content Type
                      </h4>
                      <div className="space-y-2">
                        {filterOptions.contentType.map((type) => (
                          <label
                            key={type}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={filters.contentType.includes(type)}
                              onChange={() =>
                                handleFilterChange("contentType", type)
                              }
                              className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-300">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Score Range Filter */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Score Range
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400 w-8">
                            Min:
                          </span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={filters.scoreRange.min}
                            onChange={(e) =>
                              handleScoreRangeChange(
                                "min",
                                parseInt(e.target.value)
                              )
                            }
                            className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-xs text-gray-300 w-8">
                            {filters.scoreRange.min}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400 w-8">
                            Max:
                          </span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={filters.scoreRange.max}
                            onChange={(e) =>
                              handleScoreRangeChange(
                                "max",
                                parseInt(e.target.value)
                              )
                            }
                            className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-xs text-gray-300 w-8">
                            {filters.scoreRange.max}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="p-4 border-t border-gray-700 flex items-center justify-between">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Clear all
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="btn-secondary text-sm py-1 px-3"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Apply filters logic would go here
                          console.log("Applied filters:", filters);
                          setShowFilters(false);
                        }}
                        className="btn-primary text-sm py-1 px-3"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
