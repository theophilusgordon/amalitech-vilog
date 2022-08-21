import React from "react";

const Header = ({ text }) => {
  return (
    <div className="bg-primary h-16 flex items-center justify-center">
      <h2 className="text-white font-bold text-3xl">{text}</h2>
    </div>
  );
};

export default Header;
