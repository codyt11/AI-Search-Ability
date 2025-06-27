import React, { useState } from "react";
import { ChevronDown, CheckCircle, Building2 } from "lucide-react";
import {
  industryDataCollection,
  getIndustryById,
  IndustryData,
} from "../utils/industryData";

interface IndustrySelectorProps {
  selectedIndustry: string;
  onIndustryChange: (industryId: string) => void;
}

const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  selectedIndustry,
  onIndustryChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentIndustry = getIndustryById(selectedIndustry);

  const handleIndustrySelect = (industryId: string) => {
    onIndustryChange(industryId);
    setIsOpen(false);
  };

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Building2 className="h-6 w-6 text-blue-400" />
          <div>
            <h3 className="text-lg font-bold text-white">Industry Dataset</h3>
            <p className="text-gray-400 text-sm">
              Select an industry to view tailored content gaps and insights
            </p>
          </div>
        </div>
      </div>

      {/* Industry Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentIndustry?.icon}</span>
            <div className="text-left">
              <p className="font-semibold text-white">
                {currentIndustry?.name}
              </p>
              <p className="text-sm text-gray-400">
                {currentIndustry?.description}
              </p>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            {industryDataCollection.map((industry) => (
              <button
                key={industry.id}
                onClick={() => handleIndustrySelect(industry.id)}
                className={`w-full flex items-center space-x-3 p-4 hover:bg-gray-700 transition-colors text-left border-b border-gray-700 last:border-b-0 ${
                  selectedIndustry === industry.id
                    ? "bg-blue-900/30 border-blue-500/50"
                    : ""
                }`}
              >
                <span className="text-2xl">{industry.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white">{industry.name}</p>
                  <p className="text-sm text-gray-400">
                    {industry.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>{industry.contentGaps.length} gaps</span>
                    <span>
                      {industry.keyMetrics.totalPrompts.toLocaleString()}{" "}
                      prompts/month
                    </span>
                    <span>{industry.keyMetrics.successRate}% success rate</span>
                  </div>
                </div>
                {selectedIndustry === industry.id && (
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current Industry Stats */}
      {currentIndustry && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Total Prompts</p>
            <p className="text-lg font-bold text-white">
              {currentIndustry.keyMetrics.totalPrompts.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">per month</p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Success Rate</p>
            <p className="text-lg font-bold text-green-400">
              {currentIndustry.keyMetrics.successRate}%
            </p>
            <p className="text-xs text-gray-500">current rate</p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Critical Gaps</p>
            <p className="text-lg font-bold text-red-400">
              {currentIndustry.keyMetrics.criticalGaps}
            </p>
            <p className="text-xs text-gray-500">high priority</p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Avg Fix Time</p>
            <p className="text-lg font-bold text-yellow-400">
              {currentIndustry.keyMetrics.averageFixTime}w
            </p>
            <p className="text-xs text-gray-500">to resolve</p>
          </div>
        </div>
      )}

      {/* Common Prompts Preview */}
      {currentIndustry && (
        <div className="mt-6">
          <h4 className="font-semibold text-white mb-3">
            Common Prompts in {currentIndustry.name}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentIndustry.commonPrompts.slice(0, 4).map((prompt, index) => (
              <div
                key={index}
                className="bg-gray-800/30 border border-gray-700/50 rounded p-2"
              >
                <p className="text-sm text-gray-300">"{prompt}"</p>
              </div>
            ))}
          </div>
          {currentIndustry.commonPrompts.length > 4 && (
            <p className="text-xs text-gray-500 mt-2">
              +{currentIndustry.commonPrompts.length - 4} more common prompts...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default IndustrySelector;
