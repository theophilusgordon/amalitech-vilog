import {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import {FaSignInAlt} from 'react-icons/fa'
import Header from '../components/Header'

const AdminLogin = () => {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });


    const { email, password } = formData;
    const navigate = useNavigate();

    const handleChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const adminData = {
        email,
        password,
      };

      const postData = async () => {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/admins/login`,
            adminData
          );
          if (response) {
            localStorage.setItem("auth", response.data.token);
            localStorage.setItem("id", response.data.admin_uuid);
            navigate("/dashboard");
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };

      postData();
    };

  return (
    <div>
      <Header text={"Login"} />
      <form className="w-4/5 md:w-2/5 mx-auto mt-20">
        <div className="form-group flex flex-col gap-3">
          <label htmlFor="email" className='text-gray-500 text-sm font-bold'>EMAIL</label>
          <input
            type="email"
            name="email"
            id="email"
            className="border-b-4 border-primary focus:outline-none caret-primary text-primary"
            onChange={handleChange}
          />
        </div>
        <div className="form-group flex flex-col gap-3 mt-10">
          <label htmlFor="password" className='text-gray-500 font-bold text-sm'>PASSWORD</label>
          <input
            type="password"
            name="password"
            id="password"
            className="border-b-4 border-primary focus:outline-none caret-primary text-primary"
            onChange={handleChange}
          />
        </div>
        <button className="flex items-center gap-3 font-bold text-2xl bg-primary text-white rounded px-10 py-3 mt-10"
        onClick={(e) => handleSubmit(e)}>
          <FaSignInAlt />
          LOGIN
        </button>
      </form>
    </div>
  );
}

export default AdminLogin