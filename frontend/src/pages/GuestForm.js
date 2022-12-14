import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSignInAlt } from "react-icons/fa";
import Header from "../components/Header";

const GuestForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
  });

  const navigate = useNavigate();

  const { first_name, last_name, phone, email, company } = formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const guestData = {
      first_name,
      last_name,
      phone,
      email,
      company,
    };

    const postData = async () => {
      try {
        const response = await axios.post(`/api/guests/register`, guestData);
        if (response) {
          localStorage.setItem("id", response.data.guest_id);

          await axios.post(`/api/qr-code/generate`, {
            id: response.data.guest_id,
          });

          navigate("/picture");
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    postData();
  };

  return (
    <div>
      <Header text={"Please enter your details"} />
      <form className="w-3/5 mx-auto pt-20">
        <div className="inputs grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="form-group flex flex-col">
            <label
              htmlFor="first_name"
              className="text-secondary text-sm font-bold"
            >
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              placeholder="John"
              value={first_name}
              onChange={handleChange}
              className="w-full border-b-4 border-primary focus:outline-none"
              required
            />
          </div>
          <div className="form-group flex flex-col">
            <label
              htmlFor="last_name"
              className="text-secondary text-sm font-bold"
            >
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              placeholder="Doe"
              value={last_name}
              onChange={handleChange}
              className="w-full border-b-4 border-primary focus:outline-none"
              required
            />
          </div>
          <div className="form-group flex flex-col">
            <label htmlFor="phone" className="text-secondary text-sm font-bold">
              Phone
            </label>
            <input
              type="phone"
              name="phone"
              id="phone"
              placeholder="+233XXXXXXXXX"
              value={phone}
              onChange={handleChange}
              className="w-full border-b-4 border-primary focus:outline-none"
              required
            />
          </div>
          <div className="form-group flex flex-col">
            <label htmlFor="email" className="text-secondary text-sm font-bold">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="johndoe@example.com"
              value={email}
              onChange={handleChange}
              className="w-full border-b-4 border-primary focus:outline-none"
              required
            />
          </div>
          <div className="form-group flex flex-col">
            <label
              htmlFor="company"
              className="text-secondary text-sm font-bold focus:outline-none"
            >
              Company
            </label>
            <input
              type="text"
              name="company"
              id="company"
              placeholder="John"
              value={company}
              onChange={handleChange}
              className="w-full border-b-4 border-primary focus:outline-none"
              required
            />
          </div>
        </div>
        <button
          className="bg-primary text-white rounded px-10 py-2 mt-10 flex items-center gap-2 font-bold text-2xl hover:bg-orange-500"
          onClick={(e) => handleSubmit(e)}
        >
          <FaSignInAlt />
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default GuestForm;
