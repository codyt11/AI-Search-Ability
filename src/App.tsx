import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import PromptTrends from "./pages/PromptTrends";
import ContentGapAnalysis from "./pages/ContentGapAnalysis";
import ContentAssets from "./pages/ContentAssets";
import ContentPlan from "./pages/ContentPlan";
import PromptSimulator from "./pages/PromptSimulator";
import Settings from "./pages/Settings";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <Navbar />
      <main className="container mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/prompt-trends" element={<PromptTrends />} />
          <Route path="/content-gaps" element={<ContentGapAnalysis />} />
          <Route path="/content-assets" element={<ContentAssets />} />
          <Route path="/content-plan" element={<ContentPlan />} />
          <Route path="/prompt-simulator" element={<PromptSimulator />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
