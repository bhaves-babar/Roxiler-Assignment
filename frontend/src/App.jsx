import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionTable from './Pages/TransactionTable';
import StatsViewer from './Pages/StatsViewer';
import PriceChart from './Pages/PriceChart';
import CategoryPieChart from './Pages/CategoryPieChart';
import CombinedDashboard from './Pages/CombinedDashboard';
import Navbar from './components/Navbar'; // import the Navbar
import "./App.css";
function App() {
  return (
    <Router>
      <Navbar /> {/* Render navigation here */}
      <Routes>
        <Route path="/" element={<TransactionTable />} />
        <Route path="/stats" element={<StatsViewer />} />
        <Route path="/price" element={<PriceChart />} />
        <Route path="/category" element={<CategoryPieChart />} />
        <Route path="/dashboard" element={<CombinedDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
