import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import upStyle from "./css/uploadScore.module.css";
import { ShowSidebarContext, UserInfoContext } from "../context";
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
  const { showSidebar } = useContext(ShowSidebarContext);
  const [searchParams, setSearchParams] = useSearchParams({});
  const { userInfo } = useContext(UserInfoContext);
  const [courseNo, setCourseNo] = useState(0);
  const [year, setYear] = useState(0);
  const [semester, setSemester] = useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const confirmModal = useDisclosure();
  const theme = useMantineTheme();

  const navigate = useNavigate();

  const scores = {
    courseNo: courseNo,
    year: year,
    semester: semester,
    sections: sections,
  };

  const submitData = async () => {
    let resp_course = await addCourse(scores);
    console.log(resp_course);
    if (resp_course) {
      localStorage.setItem("Upload", true);
    }
  };

  const [currentDate, setCurrentDate] = useState(new Date());

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
            isPublish: false,
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

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const resultsData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      });
      let full_score = resultsData.shift();
      const keys = resultsData.shift();
      var results = getResults(resultsData, keys);
      const secNcount = getSec(resultsData);
      const sec = secNcount.sec_list;
      const count = secNcount.countStudent;
      addSections(sec, count, keys, full_score, results);
      if (file) {
        setIsFileUploaded(true);
      } else {
        setIsFileUploaded(false);
      }
    } else {
      setIsFileUploaded(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-start py-10 lg:px-24 px-2 overflow-y-scroll max-h-max">
        <div className="bg-white flex w-full items-center justify-center py-3">
          <p className="text-primary font-semibold text-left lg:text-4xl text-xl min-w-fit pr-5">
            Score File
          </p>
          <input
            type="file"
            onChange={(e) => handleFile(e)}
            className="w-full rounded-lg border-primary border-2 p-1 lg:p-2 drop-shadow-md bg-gray-100"
            accept=".xlsx, .xls"
          />
        </div>
        <p className="bg-[#FCEFCD] rounded-lg p-4 my-3">
          Click to download this Excel
          {
            <a
              href={Template}
              download="Template"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 italic font-bold px-2"
            >
              Template
            </a>
          }
          file
          <span className="font-bold text-center text-red-500 px-2">
            (support only this template xlsx and .xls format)
          </span>
          and fill student code, score (numbers only).
          <span className="font-bold text-center text-red-500 px-2">
            Do not change the column header name.
          </span>
          And attach back to this system.
          <a
            href={Example}
            download="Example"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 italic font-bold px-2"
          >
            Example
          </a>
        </p>
        <p className="bg-[#D0CDFE] rounded-lg p-3 my-3">
          The system
          <span className="text-black px-2 font-bold">
            automatically calculates
          </span>
          the statistical values, including the mean section, mean course,
          median, maximum value, SD, upper quartile, and lower quartile. Score
          will not be automatically published after completing the upload.
        </p>
        <p className="bg-[#A8F0F4] rounded-lg p-3 my-3">
          All changes to the file, including uploads,
          <span className="text-center text-black px-2 font-bold">
            will be logged in the version history.
          </span>
        </p>
        <div className="flex flex-row w-full p-3 gap-3 ">
          <button
            className="flex flex-row justify-between items-center rounded-xl overflow-hidden border-red-500 border-2 group cursor-pointer drop-shadow-lg"
            onClick={() => {
              localStorage.setItem("Upload", true);
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
            onClick={confirmModal[1].open}
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
          <p style={{marginTop: "20px"}}>This data will be generated</p>
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
