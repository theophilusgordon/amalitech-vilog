import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Welcome from "./pages/Welcome";
import Purpose from "./pages/Purpose";
import GuestForm from "./pages/GuestForm";
import GuestPicture from "./pages/GuestPicture";
import SelectHost from "./pages/SelectHost";
import Success from "./pages/Success";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/purpose" element={<Purpose />} />
          <Route path="/guest" element={<GuestForm />} />
          <Route path="/picture" element={<GuestPicture />} />
          <Route path="/selecthost" element={<SelectHost />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
