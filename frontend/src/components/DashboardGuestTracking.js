import { useState } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { FaIdCard, FaSearch, FaFilter } from "react-icons/fa";

const DashboardGuestTracking = () => {
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
      <div className="header flex justify-between text-gray-500 font-bold text-2xl items-center py-5 px-10">
        <h1 className="flex items-center gap-3">
          <FaIdCard /> Guests
        </h1>
        <div className="search flex items-center gap-5">
          <input type="search" name="search" id="search" className="border-2" />
          <FaSearch />
          <FaFilter />
        </div>
      </div>
      <div className="list">
        <div className="list-head text-gray-500 font-semibold px-10 grid grid-cols-4">
          <h2>Guest</h2>
          <h2>Host</h2>
          <h2>Sign In</h2>
          <h2>Sign Out</h2>
        </div>
        <div className="list-body">
          {data.map((content, index) => {
            const {
              sign_in,
              guest_profile_pic,
              guest_first_name,
              guest_last_name,
              guest_company,
              host_profile_pic,
              host_first_name,
              host_last_name,
              host_company,
              sign_out,
            } = content;
            return (
              <div
                className="grid grid-cols-4 pb-3 px-10 text-gray-800"
                key={index}
              >
                <div className="flex">
                  <img
                    src={guest_profile_pic}
                    alt={`${guest_first_name}'s profile`}
                    className="w-12 aspect-square mr-3"
                  />
                  <div>
                    <p className="font-bold">
                      {guest_first_name} {guest_last_name}
                    </p>
                    <p>{guest_company}</p>
                  </div>
                </div>
                <div className="flex">
                  <img
                    src={host_profile_pic}
                    alt={`${host_first_name}'s profile`}
                    className="w-12 aspect-square mr-3"
                  />
                  <div>
                    <p className="font-bold">
                      {host_first_name} {host_last_name}
                    </p>
                    <p>{host_company}</p>
                  </div>
                </div>
                <p className="">
                  {moment(sign_in).format("DD MMM, YYYY h:mma")}
                </p>
                <p className="">
                  {sign_out !== null &&
                    moment(sign_out).format("DD MMM, YYYY h:mma")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardGuestTracking;
