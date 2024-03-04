import React, { useEffect, useState } from "react";
import "./Watchit.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import crypto from "crypto-js";
import svg from "../Assests/404.svg";
const Watchit = () => {
  const { slug } = useParams();

  const id = slug?.slice(0, 4);

  const [videos, setVideos] = useState([]);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    function decryptData(encryptedData) {
      const bytes = crypto.AES.decrypt(
        encryptedData,
        process.env.REACT_APP_KEY
      );
      const decryptedData = bytes.toString(crypto.enc.Utf8);
      return JSON.parse(decryptedData);
    }

    const fetchVideos = async () => {
      try {
        const response = await axios.get("https://api.upskillmafia.com/api/v1/videos");
        const videos = decryptData(response.data.data);
        const index = videos.videos.findIndex((v) => v.lec.toLowerCase() === id.toLowerCase());
        if (index !== -1) {
          setVideos(videos.videos[index]);
        } else {
          setValid(false);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [id]);

  function extractVideoId(url) {
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url?.match(regExp);
    return match && match[1];
  }

  if (!valid) {
    return (
      <>
        <div className="cont-404">
          <img src={svg} alt="svg" />
          <button
            className="backtoHome"
            onClick={() =>
              (window.location.href = `https://${window.location.hostname}/mern/dashboard`)
            }
          >
            Back to Home
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="w-cont">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${extractVideoId(videos.link)}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube video"
      />
    </div>
  );
};

export default Watchit;
