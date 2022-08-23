import { useState } from "react";
import Header from "../components/Header";
import { QrReader } from "react-qr-reader";

const QRCodeScan = () => {
  const [data, setData] = useState("No result");
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
      <p>{data}</p>
    </div>
  );
};

export default QRCodeScan;
