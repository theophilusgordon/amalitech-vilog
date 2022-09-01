import { useState } from "react";
import {useNavigate} from 'react-router-dom'
import Header from "../components/Header";
import { QrReader } from "react-qr-reader";

const QRCodeScan = () => {
  const [data, setData] = useState("No result");
  const navigate = useNavigate();

  localStorage.setItem("id", data);
  
  if(data !== "No result"){
    navigate('/selecthost')
  }

  return (
    <div>
      <Header text={"Scan QR Code"} />
      <div className="scan w-4/5 md:w-2/5 mx-auto">
        <QrReader
          onResult={(result, error) => {
            if (result) {
              setData(result?.text);
            }

            if (error) {
              console.info(error);
            }
          }}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default QRCodeScan;
