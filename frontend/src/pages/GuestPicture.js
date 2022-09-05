import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaSignInAlt } from "react-icons/fa";
import Header from "../components/Header";

const GuestPicture = () => {
  const id = localStorage.getItem("id");

  const [countdown, setCountdown] = useState(5);

  const navigate = useNavigate();

  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 300, height: 300 },
      })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((error) => console.log(error));
  };

  const takePhoto = () => {
    const width = 300;

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = width;

    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, width, width);
  };

  useEffect(() => {
    let timeLeft = 5;
    const timer = setInterval(function () {
      if (timeLeft <= 1) {
        clearInterval(timer);
      }
      timeLeft -= 1;
      setCountdown(timeLeft);
    }, 1000);

    getVideo();
  }, [videoRef]);

  if (countdown === 0) {
    takePhoto();
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatePhoto = async () => {
      const profile_photo = "";
      try {
        await axios.put(`/api/guests/${id}`, { profile_photo });
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    updatePhoto();
    navigate("/selecthost");
  };

  return (
    <div>
      <Header text={"Take a picture"} />
      <div className="grid md:grid-cols-2 pt-5 w-4/5 mx-auto gap-5 place-items-center">
        <div className="camera rounded aspect-square row-start-2 md:row-start-1">
          <div className="canvas">
            <canvas ref={photoRef} className="rounded absolute"></canvas>
            {countdown === 0 && (
              <button
                className="retake absolute font-bold bg-primary rounded text-white text-xl opacity-50"
                onClick={() => window.location.reload()}
              >
                Retake
              </button>
            )}
          </div>
          <video ref={videoRef} className="rounded"></video>
        </div>
        <div className="rounded-full bg-orange-400 text-white aspect-square max-w-sm row-start-1">
          <p className="p-10 md:p-20 text-center font-semibold text-2xl">
            Please smile for the camera
          </p>
          <p className="text-center text-8xl md:text-9xl">{countdown}</p>
        </div>
      </div>
      <button
        className="bg-primary text-white rounded px-10 py-2 mt-10 flex items-center gap-2 font-bold text-2xl hover:bg-orange-500 mx-auto"
        onClick={(e) => handleSubmit(e)}
      >
        <FaSignInAlt />
        SUBMIT
      </button>
    </div>
  );
};

export default GuestPicture;
