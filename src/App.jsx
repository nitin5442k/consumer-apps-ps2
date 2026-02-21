import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import CourseDetail from "./pages/CourseDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/course/:title" element={<CourseDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;