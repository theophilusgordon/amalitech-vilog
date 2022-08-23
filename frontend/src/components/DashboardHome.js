import { useState } from "react";
import axios from "axios";
import moment from "moment";
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
import { toast } from "react-toastify";
import { Line, Pie } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
Chart.register(CategoryScale);

Chart.defaults.plugins.legend.position = "left";

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
            Daily Visitors (Last 30 days)
          </h2>
          <Line
            data={{
              labels: [
                "2",
                "4",
                "6",
                "8",
                "10",
                "12",
                "14",
                "16",
                "18",
                "20",
                "22",
                "24",
                "26",
                "28",
                "30"
              ],
              datasets: [
                {
                  label: "Number of guests",
                  data: [4, 8, 12, 20, 30, 40, 50, 20, 30, 12, 2, 5, 8, 25, 30],
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
            Busiest Hosts (Last 90 days)
          </h2>
          <Pie
            data={{
              labels: [
                "Lisa-Marie Koomson",
                "Thomas Darko",
                "Emmanuel Asaber",
                "Francis Nsiah",
                "Kwamena Amo-Dadey",
                "Francis Class-Peters",
              ],
              datasets: [
                {
                  label: "Number of guests",
                  data: [80, 35, 102, 50, 30, 50],
                  borderWidth: 2,
                  backgroundColor: ["#7921B1", "#461257", "#B24BF3", "#51087E", "#BC61F5", "#D7A1F9"],
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
