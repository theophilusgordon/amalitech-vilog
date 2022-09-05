import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CheckOutGuest = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCheckOut = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/visit-logs/check-out`, {
        email,
      });
      if (response) {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div>
      <Header text={"Checking Out"} />
      <form className="flex flex-col items-center justify-center h-screen w-96 mx-auto gap-10 text-gray-700 font-bold">
        <label htmlFor="email" className="self-start">
          EMAIL
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="w-full border-b-4 border-primary focus:outline-none"
          value={email}
          onChange={(e) => handleChange(e)}
        />
        <button
          className="bg-primary px-5 py-1 rounded text-white"
          onClick={(e) => handleCheckOut(e)}
        >
          CHECK OUT
        </button>
      </form>
    </div>
  );
};

export default CheckOutGuest;
