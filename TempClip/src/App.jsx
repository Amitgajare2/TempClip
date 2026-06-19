import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Session from "./pages/Session";
import Code from "./pages/Code";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="page-wrapper" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Code />} />
        <Route path="/session/:code" element={<Session />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;