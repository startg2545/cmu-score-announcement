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

export default function UploadScorePageContainer() {
  const [sections, setSections] = useState([]);
  const { showSidebar } = useContext(ShowSidebarContext);
  const [searchParams, setSearchParams] = useSearchParams({});
  const { userInfo } = useContext(UserInfoContext);
  const [courseNo, setCourseNo] = useState(0);
  const [year, setYear] = useState(0);
  const [semester, setSemester] = useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const cancleModal = useDisclosure();
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
      <div
        className={` ${upStyle.Scorecourseframewindow}  ${
          showSidebar ? upStyle.shrink : ""
        }`}
      >
        <div className={upStyle.frameChild}>
          <div className={upStyle.ScoreInlineContainer}>
            <div className={upStyle.ScoreText}>Score File</div>
            <input
              type="file"
              onChange={(e) => handleFile(e)}
              className={` ${upStyle.ScoreTextBox} ${
                showSidebar ? upStyle["move-right"] : ""
              }`}
              accept=".xlsx, .xls"
            />
          </div>

          <div
            className={` ${upStyle.ScoreDescriptionBox} ${
              showSidebar ? upStyle["move-right"] : ""
            }`}
          >
            <p
              className={upStyle.ScoreFileDescription}
              style={{ paddingTop: "4px" }}
            >
              Click to download this Excel{" "}
              {
                <a
                  href={Template}
                  download="Template"
                  target="_blank"
                  rel="noreferrer"
                >
                  template
                </a>
              }{" "}
              file{" "}
              <span
                style={{
                  color: "red",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                (support only this template xlsx and .xls format)
              </span>{" "}
              and fill student code, score (numbers only).
              <span style={{ color: "red", fontWeight: "bold" }}>
                {" "}
                Do not change the column header name.{" "}
              </span>
              And attach back to this system.{" "}
              <a
                href={Example}
                download="Example"
                target="_blank"
                rel="noreferrer"
              >
                Example
              </a>
            </p>
          </div>
          <div
            className={`${upStyle.ScoreDescriptionBox} ${
              showSidebar ? upStyle["move-right"] : ""
            }`}
            style={{
              transform: "translateY(30px)",
              backgroundColor: "#D0CDFE",
            }}
          >
            <p
              className={upStyle.ScoreFileDescription}
              style={{ paddingTop: "4px" }}
            >
              The system{" "}
              <span style={{ fontWeight: "bold" }}>
                automatically calculates{" "}
              </span>{" "}
              the statistical values, including the mean section, mean course,
              median, maximum value, SD, upper quartile, and lower quartile.
              Score will not be automatically published after completing the
              upload.
            </p>
          </div>
          <div
            className={` ${upStyle.ScoreDescriptionBox} ${upStyle.DesBox3} ${
              showSidebar ? upStyle["move-right"] : ""
            }`}
            style={{
              transform: "translateY(38px)",
              backgroundColor: "#A8F0F4",
              height: "20px",
            }}
          >
            <p className={upStyle.ScoreFileDescription}>
              All changes to the file, including uploads,{" "}
              <span style={{ fontWeight: "bold" }}>
                {" "}
                will be logged in the version history.{" "}
              </span>
            </p>
          </div>
          <div
            className={`${upStyle.ScoreInlineContainer} ${upStyle.buttonCanCon}`}
          >
            <div
              className={upStyle.ScoreCancelButton}
              onClick={cancleModal[1].open}
            >
              <p className={upStyle.ScoreCancelText}>CANCEL</p>
              <div className={upStyle.ScoreCancelButtonInner}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <path
                    d="M5.09603 3.1778L10.5 8.5818L15.876 3.2058C15.9948 3.07941 16.1378 2.9783 16.2966 2.90853C16.4554 2.83877 16.6266 2.80178 16.8 2.7998C17.1713 2.7998 17.5274 2.9473 17.79 3.20986C18.0525 3.47241 18.2 3.8285 18.2 4.1998C18.2033 4.37145 18.1715 4.54195 18.1065 4.70084C18.0414 4.85973 17.9447 5.00366 17.822 5.1238L12.376 10.4998L17.822 15.9458C18.0528 16.1715 18.1881 16.4772 18.2 16.7998C18.2 17.1711 18.0525 17.5272 17.79 17.7898C17.5274 18.0523 17.1713 18.1998 16.8 18.1998C16.6216 18.2072 16.4436 18.1774 16.2773 18.1124C16.111 18.0473 15.96 17.9483 15.834 17.8218L10.5 12.4178L5.11003 17.8078C4.99174 17.93 4.85042 18.0275 4.69424 18.0948C4.53805 18.1621 4.37008 18.1978 4.20003 18.1998C3.82873 18.1998 3.47263 18.0523 3.21008 17.7898C2.94753 17.5272 2.80003 17.1711 2.80003 16.7998C2.79677 16.6282 2.82861 16.4577 2.89362 16.2988C2.95862 16.1399 3.0554 15.9959 3.17803 15.8758L8.62403 10.4998L3.17803 5.0538C2.94729 4.82807 2.81199 4.52238 2.80003 4.1998C2.80003 3.8285 2.94753 3.47241 3.21008 3.20986C3.47263 2.9473 3.82873 2.7998 4.20003 2.7998C4.53603 2.804 4.85803 2.9398 5.09603 3.1778Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            {isFileUploaded && (
              <div
                className={upStyle.ScoreConfirmButton}
                onClick={confirmModal[1].open}
              >
                <p className={upStyle.ScoreConfirmText}>CONFIRM</p>
                <div className={upStyle.ScoreConfirmButtonInner}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="15"
                    viewBox="0 0 21 15"
                    fill="none"
                  >
                    <path
                      d="M20.5189 0.434078C20.38 0.296534 20.2148 0.187361 20.0327 0.112859C19.8506 0.038357 19.6553 0 19.458 0C19.2608 0 19.0655 0.038357 18.8834 0.112859C18.7013 0.187361 18.536 0.296534 18.3971 0.434078L7.26494 11.3815L2.58793 6.7736C2.4437 6.63677 2.27344 6.52918 2.08688 6.45698C1.90031 6.38477 1.70109 6.34936 1.50059 6.35277C1.30009 6.35618 1.10224 6.39833 0.918332 6.47683C0.734422 6.55533 0.568056 6.66864 0.428734 6.81028C0.289412 6.95193 0.179863 7.11913 0.10634 7.30236C0.0328167 7.48558 -0.00324036 7.68123 0.000228499 7.87814C0.00369735 8.07505 0.0466239 8.26935 0.126557 8.44997C0.206489 8.63058 0.321863 8.79397 0.466091 8.93079L6.20402 14.5659C6.34293 14.7035 6.50819 14.8126 6.69028 14.8871C6.87237 14.9616 7.06768 15 7.26494 15C7.4622 15 7.6575 14.9616 7.83959 14.8871C8.02168 14.8126 8.18695 14.7035 8.32586 14.5659L20.5189 2.59128C20.6706 2.45386 20.7917 2.28708 20.8745 2.10144C20.9573 1.9158 21 1.71534 21 1.51268C21 1.31002 20.9573 1.10955 20.8745 0.923914C20.7917 0.738279 20.6706 0.571497 20.5189 0.434078Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            )}
            {!isFileUploaded && (
              <div className={` ${upStyle.ScoreConfirmButtonDisable}`}>
                <p className={`${upStyle.ScoreConfirmText} ${upStyle.disable}`}>
                  CONFIRM
                </p>
                <div
                  className={` ${upStyle.ScoreConfirmButtonInner} ${upStyle.disable}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="15"
                    viewBox="0 0 21 15"
                    fill="none"
                  >
                    <path
                      d="M20.5189 0.434078C20.38 0.296534 20.2148 0.187361 20.0327 0.112859C19.8506 0.038357 19.6553 0 19.458 0C19.2608 0 19.0655 0.038357 18.8834 0.112859C18.7013 0.187361 18.536 0.296534 18.3971 0.434078L7.26494 11.3815L2.58793 6.7736C2.4437 6.63677 2.27344 6.52918 2.08688 6.45698C1.90031 6.38477 1.70109 6.34936 1.50059 6.35277C1.30009 6.35618 1.10224 6.39833 0.918332 6.47683C0.734422 6.55533 0.568056 6.66864 0.428734 6.81028C0.289412 6.95193 0.179863 7.11913 0.10634 7.30236C0.0328167 7.48558 -0.00324036 7.68123 0.000228499 7.87814C0.00369735 8.07505 0.0466239 8.26935 0.126557 8.44997C0.206489 8.63058 0.321863 8.79397 0.466091 8.93079L6.20402 14.5659C6.34293 14.7035 6.50819 14.8126 6.69028 14.8871C6.87237 14.9616 7.06768 15 7.26494 15C7.4622 15 7.6575 14.9616 7.83959 14.8871C8.02168 14.8126 8.18695 14.7035 8.32586 14.5659L20.5189 2.59128C20.6706 2.45386 20.7917 2.28708 20.8745 2.10144C20.9573 1.9158 21 1.71534 21 1.51268C21 1.31002 20.9573 1.10955 20.8745 0.923914C20.7917 0.738279 20.6706 0.571497 20.5189 0.434078Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        opened={cancleModal[0]}
        onClose={cancleModal[1].close}
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
              Leave this page?
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="75"
            height="76"
            viewBox="0 0 55 96"
            fill="none"
          >
            <path
              d="M4.58729 22.8892C0.420621 21.175 -1.35021 16.1837 1.14979 12.5537C6.20187 5.29375 14.6394 0 25.7852 0C38.0248 0 46.4102 5.39458 50.681 12.1504C54.3269 17.9483 56.4623 28.7879 50.8373 36.8546C44.5873 45.7783 38.5977 48.5008 35.3685 54.2483C34.5873 55.6096 34.1185 56.7187 33.806 58.9875C33.3373 62.6679 30.2123 65.5417 26.3581 65.5417C21.8269 65.5417 18.129 61.7604 18.6498 57.3742C18.9623 54.8029 19.5873 52.1308 21.0456 49.61C25.056 42.6021 32.7644 38.4679 37.2435 32.2667C41.9831 25.7629 39.3269 13.6125 25.8894 13.6125C19.7956 13.6125 15.8373 16.6879 13.3894 20.3683C11.5665 23.2421 7.76437 24.1496 4.58729 22.8892ZM36.254 85.7083C36.254 91.2542 31.5665 95.7917 25.8373 95.7917C20.1081 95.7917 15.4206 91.2542 15.4206 85.7083C15.4206 80.1625 20.1081 75.625 25.8373 75.625C31.5665 75.625 36.254 80.1625 36.254 85.7083Z"
              fill="url(#paint0_linear_599_1105)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_599_1105"
                x1="27.1437"
                y1="0"
                x2="27.1437"
                y2="95.7917"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#8084C8" stopOpacity="0.53" />
                <stop offset="1" stopColor="#8084C8" />
              </linearGradient>
            </defs>
          </svg>
          <p>This data will be discarded</p>
          <div className={upStyle.ScorePopupButtons}>
            <Button
              className={Course.CancelPopupButton}
              onClick={cancleModal[1].close}
              sx={{
                color: "black",
                "&:hover": {
                  backgroundColor: "#F0EAEA",
                },
              }}
            >
              Stay
            </Button>
            <Button
              className={Course.AddPopupButton}
              onClick={() => {
                localStorage.setItem("Upload", true);
                cancleModal[1].close();
              }}
            >
              Yes, leave
            </Button>
          </div>
        </div>
      </Modal>

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
          <p>This data will be generated</p>
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
