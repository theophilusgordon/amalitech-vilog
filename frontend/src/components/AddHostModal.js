import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSignInAlt } from "react-icons/fa";

const AddHostModal = () => {
  const [formData, setFormData] = useState({
    profile_pic: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
  });

  const { profile_pic, first_name, last_name, phone, email, company } =
    formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hostData = {
      profile_pic,
      first_name,
      last_name,
      phone,
      email,
      company,
      password: "1234",
    };

    const postData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/hosts/register`,
          hostData
        );
        if (response) {
          toast.success("Host Added");
          window.location.reload();
        }
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    };

    postData();
  };
  return (
    <form className="w-4/5 mx-auto pt-20">
      <div className="form-group flex flex-col">
        <label
          htmlFor="profile_pic"
          className="text-secondary text-sm font-bold"
        >
          Upload Host Photo
        </label>
        <input type="file" name="profile" id="profile_pic" className="mb-5 text-secondary text-sm file:text-primary file:bg-white file:border-none file:hover:cursor-pointer file:font-semibold" />
      </div>
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
  );
};

export default AddHostModal;
