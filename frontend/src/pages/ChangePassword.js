import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    confirmation_code: "",
    password: "",
  });

  const { email, confirmation_code, password, confirm_password } = formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // TODO: Post to route depending on host or admin

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:500/api/change-password`
      );
      if (response) {
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div>
      <Header text={"Enter all fields to change password"} />
      <form className="w-4/5 md:w-2/5 mx-auto mt-20 flex flex-col gap-5">
        <div className="form-group flex flex-col gap-3">
          <label htmlFor="email" className="text-gray-500 text-sm font-bold">
            ENTER EMAIL
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="border-b-4 border-primary focus:outline-none caret-primary text-primary"
            onChange={(e) => handleChange(e)}
            value={email}
          />
        </div>
        <div className="form-group flex flex-col gap-3">
          <label
            htmlFor="confirmation-code"
            className="text-gray-500 text-sm font-bold"
          >
            ENTER CONFIRMATION CODE
          </label>
          <input
            type="text"
            name="confirmation_code"
            id="confirmation_code"
            className="border-b-4 border-primary focus:outline-none caret-primary text-primary"
            value={confirmation_code}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="form-group flex flex-col gap-3">
          <label htmlFor="password" className="text-gray-500 text-sm font-bold">
            ENTER PASSWORD
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="border-b-4 border-primary focus:outline-none caret-primary text-primary"
            value={password}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="form-group flex flex-col gap-3">
          <label
            htmlFor="confirm-password"
            className="text-gray-500 text-sm font-bold"
          >
            CONFIRM PASSWORD
          </label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            className="border-b-4 border-primary focus:outline-none caret-primary text-primary"
            value={confirm_password}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <button
          className="flex items-center gap-3 font-bold text-xl bg-primary text-white rounded px-10 py-1 mt-10 mr-auto"
          onClick={handleSubmit}
        >
          CHANGE PASSWORD
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
