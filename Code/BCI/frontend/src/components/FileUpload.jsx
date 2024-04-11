import { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import {
  updatePowValues,
  updateAttentionPrediction,
  updateOrderPrediction,
  updateMemoryPrediction,
} from "../features/bciSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import brain from "../assets/images/brain.jpg";
import brain2 from "../assets/images/brain2.jpg";
import Navbar from "./Navbar";
import { WiMoonAltThirdQuarter } from "react-icons/wi";
import { FaUpload } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { FaFileMedicalAlt } from "react-icons/fa";

function FileUpload() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadMessage(null);
  };
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("light");
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("pdfFile", file);

      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("File uploaded successfully", responseData);

        dispatch(
          updatePowValues({
            pow_f3_theta: responseData.pow_f3_theta,
            pow_f3_beta_l: responseData.pow_f3_beta_l,
            pow_f4_theta: responseData.pow_f4_theta,
            pow_f4_beta_l: responseData.pow_f4_beta_l,
            pow_f3_gamma: responseData.pow_f3_gamma,
            pow_f4_gamma: responseData.pow_f4_gamma,
            pow_f7_gamma: responseData.pow_f7_gamma,
            pow_f8_gamma: responseData.pow_f8_gamma,
            pow_t7_gamma: responseData.pow_t7_gamma,
            pow_t8_gamma: responseData.pow_t8_gamma,
            pow_f7_theta: responseData.pow_f7_theta,
            pow_f8_theta: responseData.pow_f8_theta,
            pow_t7_theta: responseData.pow_t7_theta,
            pow_t8_theta: responseData.pow_t8_theta,
          })
        );

        dispatch(updateAttentionPrediction(responseData.predictions[0]));
        dispatch(updateOrderPrediction(responseData.predictions[1]));
        dispatch(updateMemoryPrediction(responseData.predictions[2]));

        setUploadMessage("File uploaded successfully");
        setUploadStatus(true);

        setTimeout(() => {
          navigate("/results");
        }, 2000);
      } else {
        console.error("File upload failed");
        setUploadMessage("File upload failed");
        setUploadStatus(false);
      }
    } catch (error) {
      console.error("Error uploading file", error);
      setUploadMessage("Error uploading file");
      setUploadStatus(false);
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setUploadMessage(null);
  };

  return (
    <>
      <div
        className={`min-h-screen p-4 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        } max-sm:w-full max-sm:h-full max-sm:overflow-x-hidden mx-auto`}
      >
        <div className="flex justify-around">
          <Navbar isDarkMode={isDarkMode} />
          <div>
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center bg-blue-500 border-blue-500 hover:bg-blue-700 hover:border-blue-700 text-white font-bold py-2 px-4 rounded-md max-sm:mt-4 max-sm:mb-4 max-sm:w-full max-sm:justify-center max-sm:items-center max-sm:rounded-md max-sm:p-1 max-sm:border`}
            >
              <WiMoonAltThirdQuarter className="mr-2 max-sm:ml-2 max-sm:text-2xl" />
              Toggle Theme
            </button>
          </div>
        </div>
        <div className="">
          <div className="grid grid-rows-1 grid-cols-3 lg:gap-64 max-sm:grid-cols-1 max-sm:grid-rows-3 place-items-center max-sm:gap-y-10">
            <img
              src={brain2}
              className="h-auto lg:mt-20 lg:ml-20 rounded-2xl shadow-2xl col-span-1 max-sm:h-64 max-sm:rounded-2xl max-sm:shadow-2xl"
              alt="left img"
            />
            <div
              className={`" flex justify-center items-center rounded-lg p-10 ${
                isDarkMode ? "border border-white" : "border border-black"
              } lg:mt-20 w-96 h-96 bg-gray-100" max-sm:w-72 max-sm:h-72`}
            >
              <div className="rounded-md p-5">
                <div
                  className={`${
                    isDarkMode ? "text-white " : "text-black "
                  } flex items-center justify-center text-xl mb-10`}
                >
                  <FaFileMedicalAlt className="mr-2 text-5xl"/>Upload EEG Report
                </div>

                <input
                  type="file"
                  className={`text-center ${
                    isDarkMode
                      ? "text-white border border-white"
                      : "text-black border border-black"
                  } mb-4 p-10 rounded-md  w-80 border-dashed max-sm:p-4 max-sm:mb-2 max-sm:text-center max-sm:w-72 max-sm:border-dashed`}
                  onChange={handleFileChange}
                  placeholder="Upload PDF File"
                />

                <br />
                <div className="buttons flex justify-evenly mt-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex p-4 rounded-md justify-center items-center ${
                      isDarkMode
                        ? "bg-blue-500 text-white border border-blue-700 hover:bg-lime-200 hover:border-lime-200 hover:text-black"
                        : "bg-blue-500 text-white border border-white hover:bg-lime-200 hover:border-lime-200  hover:text-black"
                    }`}
                    onClick={handleUpload}
                  >
                    <FaUpload className="mr-2" />
                    Upload File
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex p-4 rounded-md justify-center items-center ${
                      isDarkMode
                        ? "bg-blue-500 text-white border border-blue-700 hover:bg-red-300 hover:border-red-200 hover:text-black"
                        : "bg-blue-500 text-white border border-white hover:bg-red-300 hover:border-red-200 hover:text-black"
                    }`}
                    onClick={handleDeleteFile}
                  >
                    <MdDeleteForever className="mr-2" />
                    Delete File
                  </motion.button>
                </div>
                {uploadMessage && (
                  <h3
                    className={`${
                      uploadStatus ? "text-green-400" : "text-red-400"
                    } ml-3`}
                  >
                    {uploadMessage}
                  </h3>
                )}
              </div>
            </div>
            <img
              src={brain}
              alt="right img"
              className="h-auto lg:mr-20 lg:mt-20 rounded-2xl shadow-2xl col-span-1 max-sm:h-64 max-sm:rounded-2xl max-sm:shadow-2xl"
            />
          </div>
          {file && (
            <div>
              <h2
                className={`${
                  isDarkMode ? "text-white" : "text-black"
                } text-2xl text-center p-10 underline`}
              >
                PDF Preview:
              </h2>
              <div className="px-32 max-sm:px-0">
                <Worker
                  workerUrl={`https://unpkg.com/pdfjs-dist@${"3.6.172"}/build/pdf.worker.min.js`}
                >
                  <Viewer fileUrl={URL.createObjectURL(file)} />
                </Worker>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FileUpload;
