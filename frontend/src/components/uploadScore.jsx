import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import upStyle from "./css/uploadScore.module.css";
import { StateContext, UserInfoContext } from "../context";
import { addCourse } from "../services";
import * as XLSX from "xlsx";
import Course from "../pages/css/course166.module.css";
import { Button, Modal, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Example from "../Example.xlsx";
import Template from "../Template.xlsx";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";

export default function UploadScorePageContainer() {
  const [sections, setSections] = useState([]);
  const { isUploadScore, setUploadScore } = useContext(StateContext);
  const [searchParams, setSearchParams] = useSearchParams({});
  const { userInfo } = useContext(UserInfoContext);
  const [courseNo, setCourseNo] = useState(0);
  const [year, setYear] = useState(0);
  const [semester, setSemester] = useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const confirmModal = useDisclosure();
  const theme = useMantineTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadComplete, setShowLoadComplete] = useState(false);
  const [message, setMessage] = useState();
  const [currentDate, setCurrentDate] = useState(new Date());
  const fileError = useDisclosure();
  const [row, setRow] = useState(0);
  const [column, setColumn] = useState(0);
  const [typeError, setTypeError] = useState(false);
  const [dataError, setDataError] = useState(false);

  const scores = {
    courseNo: courseNo,
    year: year,
    semester: semester,
    sections: sections,
  };

  const submitData = async () => {
    setIsLoading(true);
    let resp = await addCourse(scores);
    setIsLoading(false);
    if (resp) {
      setMessage(resp);
      setShowLoadComplete(true);
      setTimeout(() => {
        setShowLoadComplete(false);
      }, 1700);
    }
  };

  useEffect(() => {
    setCourseNo(searchParams.get("courseNo")); // get course number from Hooks
    setYear(parseInt(searchParams.get("year"))); // get year from Hooks
    setSemester(parseInt(searchParams.get("semester"))); // get semester from Hooks
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    });

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [searchParams]);

  // handle Microsoft Excel file (.xlsx)
  function getResults(list, keys) {
    // list is array of dictionary, keys is array
    const results_list = [];
    for (let i in list) {
      let obj = {};
      for (let j in keys) {
        obj[keys[j]] = list[i][j];
      }
      if (list[i][0] !== "" || list[i][1] !== "") results_list[i] = obj;
    }
    return results_list;
  }

  function getSec(list) {
    const sec_list = [];
    const countStudent = [];
    let num = 0;
    for (let i in list) {
      if (list[i][0] !== "" && !sec_list.includes(list[i][0])) {
        sec_list.push(list[i][0]);
        if (sec_list.length !== 1) {
          countStudent.push(num);
        }
        num = 0;
      }
      if (list[i][1] !== "") num++;
    }
    countStudent.push(num);
    return { sec_list, countStudent };
  }

  function addSections(sec, countStudent, keys, full_score, results) {
    const arr = [];
    for (let i = 0; i < sec.length; i++) {
      let scores_list = [];
      for (let j = 0; j < keys.length - 1; j++) {
        let results_list = [];
        let num = 0;
        for (let k in results) {
          let obj = {
            studentId: results[k]["studentId"],
            firstName: results[k]["firstName"],
            lastName: results[k]["lastName"],
            point: results[k][keys[j + 4]],
          };
          if (
            results[k]["section"] === sec[i] ||
            (results[k]["section"] === "" &&
              results_list.length &&
              results_list.length < countStudent[i])
          ) {
            results_list[num] = obj;
            num++;
          }
        }
        if (keys[j + 4]) {
          let obj = {
            scoreName: keys[j + 4],
            fullScore: full_score[j + 4],
            studentNumber: countStudent[i],
            results: results_list,
          };
          scores_list[j] = obj;
        }
      }
      arr[i] = {
        section: sec[i],
        instructor: userInfo.cmuAccount,
        scores: scores_list,
      };
    }
    console.log(arr);
    setSections(arr);
  }

  function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  function getColumnAlphabet(columnIndex) {
    let alphabet = "";
    while (columnIndex >= 0) {
      alphabet = String.fromCharCode((columnIndex % 26) + 65) + alphabet;
      columnIndex = Math.floor(columnIndex / 26) - 1;
    }
    return alphabet;
  }

  const handleFile = async (e) => {
    const file = e.target.files[0];
    setTypeError(false);
    setDataError(false);
    if (!file.name.endsWith(".xlsx")) {
      setTypeError(true);
      fileError[1].open();
      e.target.value = null;
      return;
    }

    if (file) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const resultsData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      });
      while (
        resultsData.length > 0 &&
        resultsData[resultsData.length - 1].every((cell) => cell === "")
      ) {
        resultsData.pop();
      }
      let full_score = resultsData.shift();
      const keys = resultsData.shift();

      // Validate the "point" field
      for (let i = 0; i < resultsData.length; i++) {
        for (let j = 4; j < keys.length; j++) {
          if (keys[j] && !isNumeric(resultsData[i][j])) {
            setRow(i + 3);
            setColumn(getColumnAlphabet(j));
            e.target.value = null;
            setDataError(true);
            fileError[1].open();
            return;
          }
        }
      }

      var results = getResults(resultsData, keys);
      const secNcount = getSec(resultsData);
      const sec = secNcount.sec_list;
      const count = secNcount.countStudent;
      addSections(sec, count, keys, full_score, results);

      setIsFileUploaded(true);
    } else {
      setIsFileUploaded(false);
    }
  };

  return (
    <>
      <Modal
        opened={fileError[0]}
        onClose={fileError[1].close}
        centered
        withCloseButton={false}
        size="auto"
        display="flex"
        yOffset={0}
        xOffset={0}
        padding={0}
        radius={10}
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[10],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <div className={upStyle["ScorePopup-Content"]}>
          <div className={upStyle["ScorePopup-ContentInner"]}>
            <p style={{ color: "white", fontWeight: "600" }}>Error</p>
          </div>
          <div className={upStyle.ScoreSvgInline}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="53"
              height="60"
              viewBox="0 0 63 76"
              fill="none"
              transform="translate(12, 0)"
            >
              <path
                d="M2 2H49.529L61 13.4545V74H2.00656L2 2ZM44.6129 2V18.3636H61M31.5033 64.1818V34.7273V64.1818ZM18.3936 44.5455L31.5033 31.4545L44.6129 44.5455"
                fill="url(#paint0_linear_299_1209)"
              />
              <path
                d="M44.6129 2V18.3636H61M31.5033 64.1818V34.7273M18.3936 44.5455L31.5033 31.4545L44.6129 44.5455M2 2H49.529L61 13.4545V74H2.00656L2 2Z"
                stroke="#160000"
                strokeWidth="3"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_299_1209"
                  x1="31.5"
                  y1="2"
                  x2="31.5"
                  y2="74"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    offset="0.359375"
                    stopColor="#777DDB"
                    stopOpacity="0.44"
                  />
                  <stop offset="1" stopColor="#5960D1" />
                </linearGradient>
              </defs>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="40"
              viewBox="0 0 44 40"
              fill="none"
              transform="translate(-4, 22)"
            >
              <path
                d="M26.622 3.17771L26.6221 3.17796L42.8112 31.6836C44.794 35.1767 42.2528 39.5 38.192 39.5H5.81084C1.74691 39.5 -0.793947 35.1765 1.18874 31.6836L17.3778 3.17796C19.4058 -0.392872 24.5971 -0.392349 26.622 3.17771ZM24.4033 33.7694C25.0417 33.1371 25.4013 32.2785 25.4013 31.3822C25.4013 30.4859 25.0417 29.6273 24.4033 28.995C23.7651 28.3629 22.9005 28.0086 22 28.0086C21.0994 28.0086 20.2348 28.3629 19.5966 28.995C18.9582 29.6273 18.5987 30.4859 18.5987 31.3822C18.5987 32.2785 18.9582 33.1371 19.5966 33.7694C20.2348 34.4015 21.0994 34.7558 22 34.7558C22.9005 34.7558 23.7651 34.4015 24.4033 33.7694ZM22 7.89368C21.0994 7.89368 20.2348 8.24795 19.5966 8.88008C18.9582 9.51237 18.5987 10.371 18.5987 11.2672V19.8879C18.5987 20.7842 18.9582 21.6428 19.5966 22.2751C20.2348 22.9072 21.0994 23.2615 22 23.2615C22.9005 23.2615 23.7651 22.9072 24.4033 22.2751C25.0417 21.6428 25.4013 20.7842 25.4013 19.8879V11.2672C25.4013 10.371 25.0417 9.51237 24.4033 8.88008C23.7651 8.24795 22.9005 7.89368 22 7.89368Z"
                fill="url(#paint0_linear_299_1210)"
                stroke="black"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_299_1210"
                  x1="22"
                  y1="0"
                  x2="22"
                  y2="40"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#F9E5C4" stopOpacity="0.76" />
                  <stop offset="1" stopColor="#FFBB0C" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p style={{ marginTop: "20px" }}>
            {dataError && `Row ${row}, Column ${column} must be a number.`}
            {typeError && "Support file .xlsx only"}
          </p>
          <div className={upStyle.ScorePopupButtons}>
            <Button
              className={Course.AddPopupButton}
              onClick={() => {
                fileError[1].close();
              }}
            >
              OK
            </Button>
          </div>
        </div>
      </Modal>
      {(isLoading || showLoadComplete) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75  z-50 ">
          {/* <div class="custom-box h-200 w-200 p-4 rounded-lg shadow-md inline-flex items-center bg-white "> */}
          {isLoading && (
            <div role="status" className="flex flex-col gap-5  items-center">
              <svg
                aria-hidden="true"
                class="inline w-20 h-20 mr-2  text-gray-200 animate-spin dark:text-white-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="white"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#8084c8"
                />
              </svg>
              <span className="text-white font-semibold lg:text-2xl text-md">
                Loading...
              </span>
            </div>
          )}
          {showLoadComplete && (
            <div class="flex flex-col gap-5 items-center">
              {message.ok && (
                <svg
                  class="w-20 h-20 mr-2 text-green-500 dark:text-green-400 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
              )}
              {!message.ok && (
                <svg
                  class="w-20 h-20 mr-2 text-red-500 dark:text-red-400 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M19.1001 4.9001C15.2001 1.0001 8.8001 1.0001 4.9001 4.9001C1.0001 8.8001 1.0001 15.2001 4.9001 19.1001C8.8001 23.0001 15.1001 23.0001 19.0001 19.1001C22.9001 15.2001 23.0001 8.8001 19.1001 4.9001ZM14.8001 16.2001L12.0001 13.4001L9.2001 16.2001L7.8001 14.8001L10.6001 12.0001L7.8001 9.2001L9.2001 7.8001L12.0001 10.6001L14.8001 7.8001L16.2001 9.2001L13.4001 12.0001L16.2001 14.8001L14.8001 16.2001Z"
                    fill="#F24E1E"
                  />
                </svg>
              )}
              <span className="text-white font-semibold lg:text-2xl text-md">
                {message.message}
              </span>
            </div>
          )}
        </div>
      )}
      <div
        className="flex flex-col justify-start  overflow-y-auto max-h-max
                   xl:h-[calc(84vh-150px)] lg:h-[calc(83vh-150px)] md:h-[calc(85vh-143px)] sm:h-[calc(85vh-160px)]  h-[calc(78vh-151px)] border-[2px] border-black 
                   xl:px-24 lg:px-20 md:px-20 sm:px-14 px-7
                   xl:py-9 lg:py-7 md:py-6 sm:py-5 py-3
                   sm:overflow-y-auto"
      >
        <div className=" bg-white flex w-full items-center justify-center py-3">
          <p
            className="text-primary font-semibold text-left min-w-fit pr-5
                          xl:text-2xl lg:text-2xl md:text-xl sm:text-xl text-xl cursor-default   "
          >
            Score File
          </p>
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => handleFile(e)}
            onClick={(e) => (e.target.value = null)}
            className="w-full rounded-lg border-primary border-2 p-1 lg:p-2 drop-shadow-md bg-gray-100"
          />
        </div>
        <p className="bg-[#FCEFCD] rounded-lg p-4 my-3 cursor-default">
          Click to download this Excel
          {
            <a
              href={Template}
              download="Template"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 italic font-bold px-2 underline"
            >
              Template
            </a>
          }
          file
          <span className="font-bold text-center text-red-500 px-2">
            (support only this template .xlsx format)
          </span>
          and fill student code, score (number only) and assignment name.
          <span className="font-bold text-center text-red-500 px-2">
            Do not change the column header name.
          </span>
          And attach back to this website.
          <a
            href={Example}
            download="Example"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 italic font-bold px-2 underline"
          >
            Example
          </a>
        </p>
        <p className="bg-[#D0CDFE] rounded-lg p-3 my-3 cursor-default">
          The system
          <span className="text-black px-2 font-bold cursor-default">
            automatically calculates
          </span>
          the statistical values, including the mean section, median, maximum
          score, SD, upper quartile, and lower quartile. Score
          <span className="text-black px-2 font-bold cursor-default">
            will not be automatically
          </span>
          published after completing the upload.
        </p>
        <p className="bg-[#A8F0F4] rounded-lg p-3 my-3 cursor-default">
          Note: Upload files for sections already owned
          <span className="text-center text-black px-2 font-bold">
            file will is denied.
          </span>
          If needed, please contact the section owner add co-instructor for
          permission.
        </p>
        <div className="flex flex-row w-full p-3 gap-3 ">
          <button
            className="flex flex-row justify-between items-center rounded-xl overflow-hidden border-red-500 border-2 group cursor-pointer drop-shadow-lg"
            onClick={() => {
              localStorage.removeItem("page");
              setUploadScore(false);
            }}
          >
            <p className="text-red-500 px-3 text-center items-center flex font-semibold group-hover:bg-red-500 group-hover:text-white duration-150 transition-all bg-white h-full w-30">
              CANCEL
            </p>
            <div className="items-center flex p-2 bg-red-500">
              <AiOutlineClose className="text-white text-xl" />
            </div>
          </button>
          <button
            className={`flex flex-row justify-between items-center rounded-xl overflow-hidden group border-2 drop-shadow-lg
              ${
                isFileUploaded
                  ? " border-[#1b7744] cursor-pointer "
                  : " border-gray-500 cursor-normal opacity-50"
              }`}
            disabled={!isFileUploaded}
            onClick={() => {
              confirmModal[1].open();
            }}
          >
            <p
              className={`px-3 text-center items-center flex font-semibold duration-150 transition-all bg-white h-full w-30
                ${
                  isFileUploaded
                    ? " text-[#1b7744] group-hover:bg-[#1b7744] group-hover:text-white "
                    : " text-gray-500 "
                }`}
            >
              CONFIRM
            </p>
            <div
              className={`items-center flex p-2 
                ${isFileUploaded ? " bg-[#1b7744]" : " bg-gray-500"}`}
            >
              <AiOutlineCheck className="text-white text-xl" />
            </div>
          </button>
        </div>
      </div>

      <Modal
        opened={confirmModal[0]}
        onClose={confirmModal[1].close}
        centered
        withCloseButton={false}
        size="auto"
        display="flex"
        yOffset={0}
        xOffset={0}
        padding={0}
        radius={10}
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[10],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <div className={upStyle["ScorePopup-Content"]}>
          <div className={upStyle["ScorePopup-ContentInner"]}>
            <p style={{ color: "white", fontWeight: "600" }}>
              Upload this data?
            </p>
          </div>
          <div className={upStyle.ScoreSvgInline}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="53"
              height="60"
              viewBox="0 0 63 76"
              fill="none"
              transform="translate(12, 0)"
            >
              <path
                d="M2 2H49.529L61 13.4545V74H2.00656L2 2ZM44.6129 2V18.3636H61M31.5033 64.1818V34.7273V64.1818ZM18.3936 44.5455L31.5033 31.4545L44.6129 44.5455"
                fill="url(#paint0_linear_299_1209)"
              />
              <path
                d="M44.6129 2V18.3636H61M31.5033 64.1818V34.7273M18.3936 44.5455L31.5033 31.4545L44.6129 44.5455M2 2H49.529L61 13.4545V74H2.00656L2 2Z"
                stroke="#160000"
                strokeWidth="3"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_299_1209"
                  x1="31.5"
                  y1="2"
                  x2="31.5"
                  y2="74"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    offset="0.359375"
                    stopColor="#777DDB"
                    stopOpacity="0.44"
                  />
                  <stop offset="1" stopColor="#5960D1" />
                </linearGradient>
              </defs>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="40"
              viewBox="0 0 44 40"
              fill="none"
              transform="translate(-4, 22)"
            >
              <path
                d="M26.622 3.17771L26.6221 3.17796L42.8112 31.6836C44.794 35.1767 42.2528 39.5 38.192 39.5H5.81084C1.74691 39.5 -0.793947 35.1765 1.18874 31.6836L17.3778 3.17796C19.4058 -0.392872 24.5971 -0.392349 26.622 3.17771ZM24.4033 33.7694C25.0417 33.1371 25.4013 32.2785 25.4013 31.3822C25.4013 30.4859 25.0417 29.6273 24.4033 28.995C23.7651 28.3629 22.9005 28.0086 22 28.0086C21.0994 28.0086 20.2348 28.3629 19.5966 28.995C18.9582 29.6273 18.5987 30.4859 18.5987 31.3822C18.5987 32.2785 18.9582 33.1371 19.5966 33.7694C20.2348 34.4015 21.0994 34.7558 22 34.7558C22.9005 34.7558 23.7651 34.4015 24.4033 33.7694ZM22 7.89368C21.0994 7.89368 20.2348 8.24795 19.5966 8.88008C18.9582 9.51237 18.5987 10.371 18.5987 11.2672V19.8879C18.5987 20.7842 18.9582 21.6428 19.5966 22.2751C20.2348 22.9072 21.0994 23.2615 22 23.2615C22.9005 23.2615 23.7651 22.9072 24.4033 22.2751C25.0417 21.6428 25.4013 20.7842 25.4013 19.8879V11.2672C25.4013 10.371 25.0417 9.51237 24.4033 8.88008C23.7651 8.24795 22.9005 7.89368 22 7.89368Z"
                fill="url(#paint0_linear_299_1210)"
                stroke="black"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_299_1210"
                  x1="22"
                  y1="0"
                  x2="22"
                  y2="40"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#F9E5C4" stopOpacity="0.76" />
                  <stop offset="1" stopColor="#FFBB0C" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p style={{ marginTop: "20px" }}>This data will be generated</p>
          <div className={upStyle.ScorePopupButtons}>
            <Button
              className={Course.CancelPopupButton}
              onClick={confirmModal[1].close}
              sx={{
                color: "black",
                "&:hover": {
                  backgroundColor: "#F0EAEA",
                },
              }}
            >
              No
            </Button>
            <Button
              className={Course.AddPopupButton}
              onClick={() => {
                submitData();
                confirmModal[1].close();
                localStorage.removeItem("page");
                setUploadScore(false);
              }}
            >
              Yes, Upload
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
