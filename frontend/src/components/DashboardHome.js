import { useState } from "react";
import axios from "axios";
import moment from "moment";
import { FaUser, FaFileExport, FaSave, FaShareAlt, FaClock, FaUserTag, FaUserTie } from "react-icons/fa";
import { toast } from "react-toastify";

const DashboardHome = () => {
  const [data, setData] = useState([]);

  const getLogs = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/visit-logs`);
      if (response) {
        setData(response.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  getLogs();

  return (
    <div>
      <div className="header flex justify-between h-20 px-10 font-semibold text-gray-500 text-xl">
        <h2 className="flex items-center gap-2">
          <FaUser />
          Signed In Visitors
        </h2>
        <div className="csv flex w-2/5 justify-between">
          <button className="flex items-center gap-2">
            <FaFileExport />
            EXPORT
          </button>
          <button className="flex items-center gap-2">
            <FaSave />
            SAVE
          </button>
          <button className="flex items-center gap-2">
            <FaShareAlt />
            SHARE
          </button>
        </div>
      </div>
      <div className="visit-log px-10">
        <div className="head grid grid-cols-3 text-gray-500 font-semibold">
          <h3>Signed In</h3>
          <h3>Visitor</h3>
          <h3>Host</h3>
        </div>
        <div className="content max-h-40 overflow-hidden">
          {data.map((content) => {
            const {
              sign_in,
              guest_first_name,
              guest_last_name,
              host_first_name,
              host_last_name,
            } = content;
            return (
              <div className="grid grid-cols-3 pb-3">
                <p className="flex items-center gap-2">
                  <FaClock className="text-gray-500" />
                  {moment(sign_in).format("h:mma")}
                </p>
                <p className="flex items-center gap-2">
                  <FaUserTag className="text-gray-500"/>
                  {guest_first_name} {guest_last_name}
                </p>
                <p className="flex items-center gap-2">
                  <FaUserTie className="text-gray-500"/>
                  {host_first_name} {host_last_name}
                </p>
              </div>
            );
          })}
        </div>
        <div className="graph">

        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
