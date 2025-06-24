import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Analyzer from "./pages/Analyzer";
import Analytics from "./pages/Analytics";
import PromptTrends from "./pages/PromptTrends";
import ContentGapAnalysis from "./pages/ContentGapAnalysis";
import Settings from "./pages/Settings";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <Navbar />
      <main className="container mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyze" element={<Analyzer />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/prompt-trends" element={<PromptTrends />} />
          <Route path="/content-gaps" element={<ContentGapAnalysis />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
