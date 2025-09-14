import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SWSPage from "../modules/sws/SWSPage";
import PSMPage from "../modules/psm/PSMPage";
import LogisticsPage from "../modules/logistics/LogisticsPage";
import AssetsPage from "../modules/assets/AssetsPage";
import DTRSPage from "../modules/dtrs/DTRSPage";
import Navbar from "../components/layout/Navbar";

// ✅ Import AdminPanel
import AdminPanel from "../pages/AdminPanel";

export default function AppRoutes() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Navbar (always visible) */}
        <Navbar />

        {/* Main content */}
        <main className="flex-1 p-4 bg-gray-50">
          <Routes>
            <Route path="/" element={<Navigate to="/sws" />} />
            <Route path="/sws" element={<SWSPage />} />
            <Route path="/psm" element={<PSMPage />} />
            <Route path="/logistics" element={<LogisticsPage />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/dtrs" element={<DTRSPage />} />
            
            {/* ✅ New Admin route */}
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
