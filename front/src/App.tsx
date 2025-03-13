import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import MeshPage from "./pages/MeshPage";
import ErrorPopup from "./components/ErrorPopup";

function App() {
  return (
    <Router>
      <div className="App flex flex-col h-screen">
        <Navbar />
        <div className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/" element={<MeshPage />} />
          </Routes>
        </div>
        <ErrorPopup />
      </div>
    </Router>
  );
}

export default App;
