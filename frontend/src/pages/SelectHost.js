// import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../components/Header";

const SelectHost = () => {
  // const [searchText, setSearchText] = useState("");
  // const [hosts, setHosts] = useState({});

  const handleChange = (e) => {
    // setSearchText((prevState) => ({
    //   ...prevState,
    //   [e.target.name]: e.target.value,
    // }));

    const searchHost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/hosts`);

        if (response) {
          // setHosts(response.data);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    searchHost();
  };

  return (
    <div>
      <Header text={"Who are you visiting?"} />
      <div className="flex flex-col w-4/5 mx-auto mt-20">
        <label htmlFor="search">SEARCH</label>
        <input
          type="search"
          name="host_name"
          id="host_name"
          className="border rounded max-w-xl h-10 focus:outline-none px-5"
          onChange={handleChange}
        />
      </div>
      {/* <div className="search-hosts">
        {hosts.map((host) => {
          host.host_first_name.includes(searchText);
          return(<div>{host}</div>)
        })}
      </div> */}
    </div>
  );
};

export default SelectHost;
