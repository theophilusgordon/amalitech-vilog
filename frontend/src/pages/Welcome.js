import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo-welcome.png";
import qrCode from "../images/qr-code.svg";
import vilogLogo from "../images/vilog-logo.svg";

const Welcome = () => {
  return (
    <div className="welcome h-screen flex flex-col justify-center">
      <img src={logo} alt="logo" className="mx-auto mt-5" />
      <p className="text-blue-800 text-center text-sm ">
        Empowering the next generation of technology leaders in Africa
      </p>
      <h1 className="text-secondary text-center uppercase align-middle font-bold text-9xl py-10">
        Welcome
      </h1>
      <div className="flex w-4/5 mx-auto justify-between items-center">
        <Link to="/qr-code-scan" className="flex flex-col items-center">
          <p className="text-primary font-bold text-xs">CLICK HERE TO SCAN QR CODE</p>
          <img src={qrCode} alt="QR Code Scanner" />
        </Link>
        <h2 className="text-primary font-bold text-4xl">
          <Link to="/purpose">CLICK HERE</Link>
        </h2>
        <img src={vilogLogo} alt="ViLog Logo" className="w-48"/>
      </div>
    </div>
  );
};

export default Welcome;
