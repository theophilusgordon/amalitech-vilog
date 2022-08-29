import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {FaHome, FaUserTag, FaUserTie, FaSignOutAlt} from 'react-icons/fa'
import logo from '../images/Dashboard Logo.png'
import DashboardHome from '../components/DashboardHome';
import DashboardGuestTracking from '../components/DashboardGuestTracking'
import DashboardHosts from '../components/DashboardHosts'

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("home");

  let element;

  if(tab === 'home') element = <DashboardHome />;
  if(tab === 'guest-tracking') element = <DashboardGuestTracking />;
  if(tab === 'hosts') element = <DashboardHosts />;


  const handleLogout = () => {
    navigate("/");
    localStorage.clear()
  }

  const handleActive = (tab) => {
    setTab(tab)
  }

  return (
    <div>
      <div className="flex">
        <nav className="bg-primary w-1/5 h-screen fixed">
          <div className="logo w-full h-20 bg-white flex">
            <img src={logo} alt="AmaliTech Logo" className="my-auto" />
          </div>
          <div className="flex flex-col justify-between pl-10 pt-10">
            <div className="nav-items">
              <p
                className="w-full h-14 font-bold text-2xl text-white flex items-center gap-2 hover:cursor-pointer"
                onClick={(e) => handleActive("home")}
              >
                <FaHome />
                Dashboard
              </p>
              <p
                className="w-full h-14 font-bold text-2xl text-white flex items-center gap-2 hover:cursor-pointer"
                onClick={(e) => handleActive("guest-tracking")}
              >
                <FaUserTag />
                Guest Tracking
              </p>
              <p
                className="w-full h-14 font-bold text-2xl text-white flex items-center gap-2 hover:cursor-pointer"
                onClick={() => handleActive("hosts")}
              >
                <FaUserTie />
                Hosts
              </p>
            </div>
            <div
              className="logout absolute bottom-10 w-full h-14 font-bold text-2xl text-white flex items-center gap-2 hover:cursor-pointer hover:text-orange-200"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </div>
          </div>
        </nav>
        <main className="ml-auto w-4/5">{element}</main>
      </div>
    </div>
  );
}

export default AdminDashboard