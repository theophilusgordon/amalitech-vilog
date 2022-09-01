import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { saveAs } from "file-saver";
import {
  FaUser,
  FaFileExport,
  FaSave,
  FaShareAlt,
  FaClock,
  FaUserTag,
  FaUserTie,
  FaChartLine,
} from "react-icons/fa";
import SendEmailModal from "../components/SendEmailModal";
import { toast } from "react-toastify";
import { Line, Pie } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
Chart.register(CategoryScale);

Chart.defaults.plugins.legend.position = "left";

let check = true;
let ids = [];
const DashboardHome = () => {
  const [data, setData] = useState([]);
  const [showSendEmailModal, setShowSendEmailModal] = useState(false);
  const [hostData, setHostData] = useState([]);
  const [hostGuestsNumbers, setHostGuestsNumbers] = useState([]);

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

  const handleExport = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/export-csv`);
      if (response) {
        toast.success("Export to CSV successful");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // FIXME: Download file not working properly
  const getDownloadFile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/export-csv", {
        responseType: "blob",
      });
      console.log(response);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const downloadFile = () => {
    getDownloadFile().then((blob) => saveAs(blob, "file.csv"));
  };

  const handleShare = () => {
    showSendEmailModal
      ? setShowSendEmailModal(false)
      : setShowSendEmailModal(true);
  };

  useEffect(() => {
    const getHosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/hosts`);
        if (response) {
          setHostData(response.data);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    getHosts();
  }, [hostData]);

  const names = hostData.map((host) => {
    return `${host.host_first_name} ${host.host_last_name}`;
  });

  if (check) {
    ids = hostData.map((host) => {
      return host.host_uuid;
    });
    if (ids.length > 1) {
      check = false;
    }
  }

  useEffect(() => {
    ids.map((id) => {
      return async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/guests/host/${id}`
          );
          if (response) {
            setHostGuestsNumbers(response.data.length);
          }
        } catch (error) {
          console.log(error);
        }
      };
    });
  }, [hostGuestsNumbers]);

  // console.log(hostGuestsNumbers);

  return (
    <div>
      <div className="header flex justify-between h-20 px-10 font-semibold text-gray-500 text-xl">
        <h2 className="flex items-center gap-2">
          <FaUser />
          Signed In Visitors
        </h2>
        <div className="csv flex w-2/5 justify-between">
          <button className="flex items-center gap-2" onClick={handleExport}>
            <FaFileExport />
            EXPORT
          </button>
          <button className="flex items-center gap-2" onClick={downloadFile}>
            <FaSave />
            SAVE
          </button>
          <button className="flex items-center gap-2" onClick={handleShare}>
            <FaShareAlt />
            SHARE
          </button>
        </div>
      </div>
      {showSendEmailModal && <SendEmailModal />}
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
                  <FaUserTag className="text-gray-500" />
                  {guest_first_name} {guest_last_name}
                </p>
                <p className="flex items-center gap-2">
                  <FaUserTie className="text-gray-500" />
                  {host_first_name} {host_last_name}
                </p>
              </div>
            );
          })}
        </div>
        <div className="visit-chart mt-10">
          <h2 className="flex items-center gap-2 font-semibold text-gray-500 text-xl">
            <FaChartLine />
            Daily Visitors (Last 7 days)
          </h2>
          <Line
            data={{
              labels: ["1", "2", "3", "4", "5", "6", "7"],
              datasets: [
                {
                  label: "Number of guests",
                  data: [4, 8, 12, 20, 30, 50, 21],
                  borderWidth: 2,
                  backgroundColor: "orange",
                },
              ],
            }}
            height={200}
            width={600}
            options={{
              maintainAspectRatio: true,
            }}
          />
        </div>
        <div className="hosts-chart mt-10 w-3/5">
          <h2 className="flex items-center gap-2 font-semibold text-gray-500 text-xl">
            <FaChartLine />
            Busiest Hosts
          </h2>
          <Pie
            data={{
              labels: names,
              datasets: [
                {
                  label: "Number of guests",
                  data: [20, 35, 10],
                  borderWidth: 2,
                  backgroundColor: [
                    "#7921B1",
                    "#461257",
                    "#B24BF3",
                    "#51087E",
                    "#BC61F5",
                    "#D7A1F9",
                  ],
                },
              ],
            }}
            height={100}
            width={100}
            options={{
              maintainAspectRatio: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
