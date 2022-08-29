import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify'
import Header from "../components/Header";

const ConfirmationCode = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/hosts/confirmation-code`,
        {
          email,
        }
      );
      if (response) {
        navigate("/change-password");
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  return (
    <div>
      <Header text={"Enter email to get confirmation code"} />
      <div className="form-group flex flex-col gap-3 mt-20 w-2/5 min-w-9xl mx-auto">
        <label
          htmlFor="email"
          className="text-gray-500 text-sm font-bold"
        >EMAIL</label>
        <input
          type="email"
          name="email"
          id="email"
          className="border-b-4 border-primary focus:outline-none caret-primary text-primary"
          value={email}
          onChange={(e) => handleChange(e)}
        />
        <button
          className="flex items-center gap-3 font-bold text-2xl bg-primary text-white rounded px-10 py-3 mt-10 mr-auto"
          onClick={handleSubmit}
        >
          GET CONFIRMATION CODE
        </button>
      </div>
    </div>
  );
};

export default ConfirmationCode;
