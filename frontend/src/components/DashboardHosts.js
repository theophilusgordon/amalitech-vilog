import { useState, useEffect } from "react";
import axios from "axios";
import { FaUserTie, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import AddHostModal from "./AddHostModal";
import defaultPhoto from "../images/default_photo.svg";


const DashboardHosts = () => {
  const [hosts, setHosts] = useState([]);
  const [showAddHostModal, setShowAddHostModal] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleDelete = (host_uuid) => {
    try {
      const response = axios.delete(
        `http://localhost:5000/api/hosts/${host_uuid}`
      );
      if (response) {
        toast.success("Host Deleted");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleAddHost = () => {
    showAddHostModal ? setShowAddHostModal(false) : setShowAddHostModal(true);
  };

  return (
    <div>
      <div className="header flex items-center px-10 py-5 justify-between font-bold text-xl text-gray-500">
        <h1 className="flex items-center gap-3">
          <FaUserTie /> Hosts
        </h1>
        <div className="search-add flex items-center gap-3">
          <input type="search" name="search" id="search" className="border-2" />{" "}
          <FaSearch />
          <button
            className="bg-primary text-white px-5 py-1 rounded"
            onClick={handleAddHost}
          >
            ADD HOST
          </button>
        </div>
      </div>
      {showAddHostModal ? (
        <AddHostModal />
      ) : (
        <div className="hosts">
          {hosts.map((host, index) => {
            const {
              host_profile_pic,
              host_first_name,
              host_last_name,
              host_email,
              host_uuid,
            } = host;

            return (
              <div className="grid grid-cols-4 ml-10 my-5" key={index}>
                <div className="host flex text-gray-700 gap-3 col-span-3">
                  {host_profile_pic ? (
                    <img
                      src={host_profile_pic}
                      alt={`${host_first_name}'s profile`}
                      className="w-12 aspect-square"
                    />
                  ) : (
                    <img
                      src={defaultPhoto}
                      alt="Default"
                      className="w-12 aspect-square rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-bold">
                      {host_first_name} {host_last_name}
                    </p>
                    <p>{host_email}</p>
                  </div>
                </div>
                <button
                  className="border-2 m-auto px-5 py-0.5 rounded border-primary font-semibold text-gray-700 hover:bg-primary hover:text-white transition-all duration-500 ease-in-out"
                  onClick={() => handleDelete(host_uuid)}
                >
                  REMOVE HOST
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardHosts;
