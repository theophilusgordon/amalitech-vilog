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
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import QRCodeScan from "./pages/QRCodeScan";
import CheckOutGuest from "./pages/CheckOutGuest";
import HostLogin from "./pages/HostLogin";
import ConfirmationCode from "./pages/ConfirmationCode";
import ChangePassword from "./pages/ChangePassword";
import HostDashboard from "./pages/HostDashboard";

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
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/qr-code-scan" element={<QRCodeScan />} />
          <Route path="/check-out" element={<CheckOutGuest />} />
          <Route path="/host-login" element={<HostLogin />} />
          <Route path="/confirmation-code" element={<ConfirmationCode />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path='/host-dashboard' element={<HostDashboard />}/>
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
