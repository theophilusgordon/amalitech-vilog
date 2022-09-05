import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../components/Header";

const SelectHost = () => {
  const [searchText, setSearchText] = useState("");
  const [hosts, setHosts] = useState([]);
  const [searching, setSearching] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchText(e.target.value);

    searchText.length <= 1 ? setSearching(false) : setSearching(true);
  };

  useEffect(() => {
    const searchHost = async () => {
      try {
        const response = await axios.get(`/api/guests/hosts`);

        if (response) {
          setHosts(
            response.data.filter(
              (host) =>
                host.host_first_name
                  .toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                host.host_last_name
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
            )
          );
        }
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error.message);
      }
    };
    searchHost();
  }, [searchText]);

  const handleSelect = async (host_uuid) => {
    const id = localStorage.getItem("id");
    try {
      const response = await axios.post(`/api/visit-logs/check-in/${id}`, {
        host_id: host_uuid,
      });
      if (response) {
        navigate("/success");
        localStorage.clear();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Header text={"Who are you visiting?"} />

      <div className="w-4/5 mx-auto">
        <div className="flex flex-col mt-20">
          <label htmlFor="search">SEARCH</label>
          <input
            type="search"
            name="host_name"
            id="host_name"
            className="border rounded max-w-xl h-10 focus:outline-none px-5 caret-primary text-primary"
            onChange={handleChange}
          />
        </div>
        {searching && (
          <div className="search-hosts w-4/5 mt-5 max-w-md hover:cursor-pointer">
            {hosts.map((host, index) => {
              const {
                host_uuid,
                host_profile_pic,
                host_first_name,
                host_last_name,
                host_company,
              } = host;

              return (
                <div
                  key={index}
                  className="px-5 py-2 my-5 flex bg-primary rounded text-white gap-10 items-center"
                  onClick={() => handleSelect(host_uuid)}
                >
                  <img
                    src={host_profile_pic}
                    alt={`${host_first_name}'s profile pic`}
                    className="w-10 aspect-square text-xs rounded-full"
                  />
                  <div className="details">
                    <h3 className="font-bold text-xl">
                      {host_first_name} {host_last_name}
                    </h3>
                    <p>{host_company}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectHost;
