import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Header from '../components/Header'

const Purpose = () => {
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setUserType(e.target.value)
    if (e.target.value === "guest") navigate("/guest");
    if (e.target.value === "admin") navigate("/admin-login");
  }
  return (
    <div>
      <Header text={"How may we help you?"} />
      <div className="flex mt-20 justify-center items-center">
        <h2 className="text-2xl md:text-5xl font-bold text-secondary">I am</h2>
        <select
          name="user_type"
          id="user_type"
          className="border-none focus:border-none bg-orange-400 grid grid-cols-1 divide-y w-40 md:w-80 ml-10 text-white font-bold text-2xl md:text-4xl"
          value={userType}
          onChange={(e) => handleChange(e)}
        >
          <option className='text-white text-base md:text-3xl' value="" disabled></option>
          <option className='text-white text-base md:text-3xl' value="guest">a guest</option>
          <option className='text-white text-base md:text-3xl' value="host">a host</option>
          <option className='text-white text-base md:text-3xl' value="admin">an admin</option>
          <option className='text-white text-base md:text-3xl' value="signing_out">signing out</option>
        </select>
      </div>
    </div>
  );
}

export default Purpose