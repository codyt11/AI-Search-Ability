// DAM Integration Component
// Allows users to connect to Digital Asset Management systems

import React, { useState, useEffect } from "react";
import {
  Database,
  Plus,
  Settings,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Eye,
  Filter,
  Calendar,
  Tag,
  FileText,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import {
  DAMIntegrationService,
  DAMConnection,
  DAMPlatform,
  DAMAsset,
  SyncResult,
  DAMCredentials,
} from "../services/damIntegration";
import DAMContentAnalysis from "./DAMContentAnalysis";

interface Props {
  onAssetsImported?: (assets: DAMAsset[]) => void;
}

const DAMIntegration: React.FC<Props> = ({ onAssetsImported }) => {
  const [damService] = useState(() => new DAMIntegrationService());
  const [connections, setConnections] = useState<DAMConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(
    null
  );
  const [assets, setAssets] = useState<DAMAsset[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showNewConnectionModal, setShowNewConnectionModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<DAMAsset | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // New connection form state
  const [newConnection, setNewConnection] = useState({
    platform: "adobe_aem" as DAMPlatform,
    name: "",
    credentials: {} as DAMCredentials,
    apiEndpoint: "",
  });

  // Filter state
  const [filters, setFilters] = useState({
    categories: [] as string[],
    tags: [] as string[],
    fileTypes: [] as string[],
    modifiedSince: undefined as Date | undefined,
  });

  useEffect(() => {
    loadConnections();
  }, []);

  useEffect(() => {
    if (selectedConnection) {
      loadAssets();
    }
  }, [selectedConnection]);

  const loadConnections = () => {
    const conns = damService.getConnections();
    setConnections(conns);
  };

  const loadAssets = async () => {
    if (!selectedConnection) return;

    try {
      const connectionAssets = await damService.getAssetsByConnection(
        selectedConnection
      );
      setAssets(connectionAssets);
    } catch (error) {
      console.error("Error loading assets:", error);
    }
  };

  const handleCreateConnection = async () => {
    setIsConnecting(true);
    try {
      const connection = await damService.createConnection(
        newConnection.platform,
        newConnection.name,
        newConnection.credentials,
        newConnection.apiEndpoint
      );

      loadConnections();
      setShowNewConnectionModal(false);
      setNewConnection({
        platform: "adobe_aem",
        name: "",
        credentials: {},
        apiEndpoint: "",
      });
    } catch (error) {
      console.error("Error creating connection:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async () => {
    if (!selectedConnection) return;

    setIsSyncing(true);
    try {
      const result = await damService.syncAssets(selectedConnection, filters);
      setSyncResult(result);
      if (result.success) {
        loadAssets();
        if (onAssetsImported) {
          onAssetsImported(assets);
        }
      }
    } catch (error) {
      console.error("Error syncing assets:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExport = async () => {
    if (!selectedConnection || assets.length === 0) return;

    setIsExporting(true);
    try {
      const result = await damService.exportAssets(selectedConnection, assets, {
        format: "json",
        includeContent: true,
        includeMetadata: true,
      });

      if (result.success && result.exportUrl) {
        // In real implementation, this would trigger download
        alert(`Export successful! ${result.assetsExported} assets exported.`);
      }
    } catch (error) {
      console.error("Error exporting assets:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteConnection = async (connectionId: string) => {
    if (confirm("Are you sure you want to delete this connection?")) {
      await damService.deleteConnection(connectionId);
      loadConnections();
      if (selectedConnection === connectionId) {
        setSelectedConnection(null);
        setAssets([]);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const platforms = damService.getPlatforms();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">DAM Integration</h2>
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-300 focus:outline-none"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                <div className="font-semibold mb-1">DAM Integration</div>
                <div className="space-y-1">
                  <div>• Connect to your Digital Asset Management system</div>
                  <div>
                    • Import content directly from your DAM for AI analysis
                  </div>
                  <div>• Export analysis results back to your DAM</div>
                  <div>• Keep content synchronized between systems</div>
                  <div>
                    • Support for major DAM platforms like Adobe AEM, Bynder,
                    etc.
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowNewConnectionModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Connection</span>
        </button>
      </div>

      {/* Connections List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Connections</h3>
          <div className="space-y-3">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedConnection === connection.id
                    ? "border-blue-500 bg-blue-900/20"
                    : "border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                }`}
                onClick={() => setSelectedConnection(connection.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{connection.name}</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(connection.status)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConnection(connection.id);
                      }}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <div>{platforms.get(connection.platform)?.name}</div>
                  {connection.lastSync && (
                    <div>
                      Last sync: {connection.lastSync.toLocaleDateString()}
                    </div>
                  )}
                  {connection.assetCount && (
                    <div>{connection.assetCount} assets</div>
                  )}
                </div>
              </div>
            ))}

            {connections.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No DAM connections configured</p>
                <p className="text-sm">Add a connection to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Assets Panel */}
        <div className="lg:col-span-2">
          {selectedConnection ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Assets</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
                    />
                    <span>{isSyncing ? "Syncing..." : "Sync"}</span>
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={isExporting || assets.length === 0}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{isExporting ? "Exporting..." : "Export"}</span>
                  </button>
                </div>
              </div>

              {/* Sync Result */}
              {syncResult && (
                <div
                  className={`mb-4 p-3 rounded-lg ${
                    syncResult.success
                      ? "bg-green-900/30 border border-green-600"
                      : "bg-red-900/30 border border-red-600"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {syncResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                    <span
                      className={
                        syncResult.success ? "text-green-200" : "text-red-200"
                      }
                    >
                      {syncResult.success
                        ? `Successfully imported ${syncResult.assetsImported} assets in ${syncResult.duration}ms`
                        : `Sync failed: ${syncResult.errors.join(", ")}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Assets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-4 border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white truncate">
                        {asset.name}
                      </h4>
                      <button
                        onClick={() => {
                          setSelectedAsset(asset);
                          setShowAssetModal(true);
                        }}
                        className="text-gray-400 hover:text-blue-400"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-sm text-gray-400 space-y-1">
                      <div>Type: {asset.fileType.toUpperCase()}</div>
                      <div>Size: {(asset.size / 1024).toFixed(1)} KB</div>
                      <div>
                        Modified: {asset.lastModified.toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {asset.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {asset.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          +{asset.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {assets.length === 0 && selectedConnection && (
                <div className="text-center py-8 text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No assets found</p>
                  <p className="text-sm">
                    Try syncing to import assets from your DAM
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a DAM connection</p>
              <p>Choose a connection from the list to view and manage assets</p>
            </div>
          )}
        </div>
      </div>

      {/* New Connection Modal */}
      {showNewConnectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              Add DAM Connection
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Platform
                </label>
                <select
                  value={newConnection.platform}
                  onChange={(e) =>
                    setNewConnection((prev) => ({
                      ...prev,
                      platform: e.target.value as DAMPlatform,
                    }))
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  {Array.from(platforms.entries()).map(([platform, config]) => (
                    <option key={platform} value={platform}>
                      {config.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {platforms.get(newConnection.platform)?.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Connection Name
                </label>
                <input
                  type="text"
                  value={newConnection.name}
                  onChange={(e) =>
                    setNewConnection((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="My DAM Connection"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>

              {/* Platform-specific credential fields */}
              {platforms.get(newConnection.platform)?.authType ===
                "api_key" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={newConnection.credentials.apiKey || ""}
                    onChange={(e) =>
                      setNewConnection((prev) => ({
                        ...prev,
                        credentials: {
                          ...prev.credentials,
                          apiKey: e.target.value,
                        },
                      }))
                    }
                    placeholder="Enter your API key"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              )}

              {platforms.get(newConnection.platform)?.authType ===
                "basic_auth" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={newConnection.credentials.username || ""}
                      onChange={(e) =>
                        setNewConnection((prev) => ({
                          ...prev,
                          credentials: {
                            ...prev.credentials,
                            username: e.target.value,
                          },
                        }))
                      }
                      placeholder="Username"
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={newConnection.credentials.password || ""}
                      onChange={(e) =>
                        setNewConnection((prev) => ({
                          ...prev,
                          credentials: {
                            ...prev.credentials,
                            password: e.target.value,
                          },
                        }))
                      }
                      placeholder="Password"
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Endpoint (Optional)
                </label>
                <input
                  type="url"
                  value={newConnection.apiEndpoint}
                  onChange={(e) =>
                    setNewConnection((prev) => ({
                      ...prev,
                      apiEndpoint: e.target.value,
                    }))
                  }
                  placeholder="https://your-dam-instance.com/api"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="bg-blue-900/30 border border-blue-600 rounded p-3">
                <h4 className="text-sm font-medium text-blue-200 mb-1">
                  Setup Instructions
                </h4>
                <p className="text-xs text-blue-300">
                  {platforms.get(newConnection.platform)?.setupInstructions}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewConnectionModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateConnection}
                disabled={isConnecting || !newConnection.name}
                className="btn-primary"
              >
                {isConnecting ? "Connecting..." : "Create Connection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Detail Modal */}
      {showAssetModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {selectedAsset.name}
              </h3>
              <button
                onClick={() => setShowAssetModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-2">
                  Asset Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Type:</span>{" "}
                    {selectedAsset.fileType.toUpperCase()}
                  </div>
                  <div>
                    <span className="text-gray-400">Size:</span>{" "}
                    {(selectedAsset.size / 1024).toFixed(1)} KB
                  </div>
                  <div>
                    <span className="text-gray-400">Created:</span>{" "}
                    {selectedAsset.createdDate.toLocaleDateString()}
                  </div>
                  <div>
                    <span className="text-gray-400">Modified:</span>{" "}
                    {selectedAsset.lastModified.toLocaleDateString()}
                  </div>
                  {selectedAsset.author && (
                    <div>
                      <span className="text-gray-400">Author:</span>{" "}
                      {selectedAsset.author}
                    </div>
                  )}
                  {selectedAsset.version && (
                    <div>
                      <span className="text-gray-400">Version:</span>{" "}
                      {selectedAsset.version}
                    </div>
                  )}
                </div>

                <h4 className="font-medium text-white mt-4 mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAsset.categories.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                <h4 className="font-medium text-white mt-4 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAsset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">Content Preview</h4>
                <div className="bg-gray-900/50 p-3 rounded border max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-300">
                    {selectedAsset.content}
                  </pre>
                </div>

                {selectedAsset.description && (
                  <>
                    <h4 className="font-medium text-white mt-4 mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-gray-300">
                      {selectedAsset.description}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DAM Content Analysis */}
      {assets.length > 0 && (
        <DAMContentAnalysis
          damAssets={assets}
          onAnalysisComplete={(results) => {
            console.log(`Analysis completed for ${results.length} assets`);
          }}
        />
      )}
    </div>
  );
};

export default DAMIntegration;
