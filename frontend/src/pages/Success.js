import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { FaCheck } from "react-icons/fa";

const Success = () => {
  const navigate = useNavigate();

  setTimeout(() => {
    navigate("/");
  }, 10000);

  return (
    <div>
      <Header text={"Success"} />
      <div className="flex flex-col justify-center items-center h-screen">
        <FaCheck className="bg-primary w-20 h-20 rounded-full text-white font-bold" />
        <p className="font-bold text-primary mt-5">SIGNED IN</p>
      </div>
    </div>
  );
};

export default Success;
