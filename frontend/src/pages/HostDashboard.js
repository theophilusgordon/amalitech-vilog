import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { FaHome, FaSignOutAlt, FaIdCardAlt } from "react-icons/fa";
import defaultPhoto from "../images/default_photo.svg";
import { useNavigate } from "react-router-dom";

const HostDashboard = () => {
  const id = localStorage.getItem("id");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const getLogs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/visit-logs/${id}`
      );
      if (response) {
        setData(response.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  getLogs();

  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
  };

  return (
    <div>
      <nav className="w-1/5 h-screen fixed text-2xl bg-primary font-bold text-white px-5 py-20">
        <h2 className="flex items-center gap-3 hover:cursor-pointer">
          <FaHome className="text-3xl" /> Dashboard
        </h2>
        <h2
          className="flex items-center gap-3 absolute bottom-20 hover:cursor-pointer"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-3xl" /> Logout
        </h2>
      </nav>
      <main className="ml-auto w-4/5 px-10 pt-5">
        <div className="header">
          <h1 className="flex items-center text-3xl font-bold text-gray-700 gap-3">
            <FaIdCardAlt /> Guests
          </h1>
        </div>
        <div className="grid grid-cols-4 font-semibold text-gray-700 mt-5">
          <h3 className="col-span-2">Guest</h3>
          <h3>Sign In</h3>
          <h3>Sign Out</h3>
        </div>
        {data.length > 0
          ? data.map((log) => {
              const {
                guest_profile_pic,
                guest_first_name,
                guest_last_name,
                guest_company,
                sign_in,
                sign_out,
              } = log;
              return (
                <div className="grid grid-cols-4 font-semibold text-gray-700 my-5">
                  <div className="col-span-2 flex">
                    {guest_profile_pic ? (
                      <img
                        src={guest_profile_pic}
                        alt=""
                        className="w-12 aspect-square rounded-full"
                      />
                    ) : (
                      <img
                        src={defaultPhoto}
                        alt="Default"
                        className="w-12 aspect-square rounded-full"
                      />
                    )}
                    <div className="pl-5">
                      <p>
                        {guest_first_name} {guest_last_name}
                      </p>
                      <p className="font-normal">{guest_company}</p>
                    </div>
                  </div>
                  <p className="font-normal">
                    {moment(sign_in).format("DD MMM, YYYY h:mma")}
                  </p>
                  <p className="font-normal">
                    {sign_out && moment(sign_out).format("DD MMM, YYYY h:mma")}
                  </p>
                </div>
              );
            })
          : null}
      </main>
    </div>
  );
};

export default HostDashboard;
