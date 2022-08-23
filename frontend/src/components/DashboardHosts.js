import {useState} from "react";
import axios from "axios";
import { FaUserTie, FaSearch } from "react-icons/fa";
import {toast} from 'react-toastify'

const DashboardHosts = () => {
  const [hosts, setHosts] = useState([]);
   const searchHost = async () => {
     try {
       const response = await axios.get(`http://localhost:5000/api/hosts`);

       if (response) {
         setHosts(response.data);
       }
     } catch (error) {
       toast.error(error.response.data.message);
     }
   };
   searchHost();

   const handleEdit = (host_uuid) => {

   }

     const handleDelete = (host_uuid) => {};

  return (
    <div>
      <div className="header flex items-center px-10 py-5 justify-between font-bold text-xl text-gray-500">
        <h1 className="flex items-center gap-3">
          <FaUserTie /> Hosts
        </h1>
        <div className="search-add flex items-center gap-3">
          <input type="search" name="search" id="search"  className="border-2"/> <FaSearch />
          <button className="bg-primary text-white px-5 py-1 rounded">ADD HOST</button>
        </div>
      </div>
      <div className="hosts">
        {hosts.map((host, index) => {
          const {host_profile_pic, host_first_name, host_last_name, host_email, host_uuid} = host;

          return (
            <div className="grid grid-cols-5" key={index}>
              <div className="host flex text-gray-700 gap-3 col-span-3">
                <img
                  src={host_profile_pic}
                  alt={`${host_first_name}'s profile`}
                  className="w-12 aspect-square"
                />
                <div>
                  <p className="font-bold">
                    {host_first_name} {host_last_name}
                  </p>
                  <p>{host_email}</p>
                </div>
              </div>
              <button
                className="bg-primary m-auto px-5 py-1 rounded text-white"
                onClick={() => handleEdit(host_uuid)}
              >
                EDIT HOST
              </button>
              <button
                className="border-2 m-auto px-5 py-0.5 rounded border-primary"
                onClick={() => handleDelete(host_uuid)}
              >
                REMOVE HOST
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardHosts;
