import { ShowSidebarContext } from "../context";
import { useSearchParams } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { getScores, addStudentGrade } from "../services";
import secMan from "./css/manage.module.css";
import TableScore from "./TableScore";
import Course from "../pages/css/course166.module.css";
import upStyle from "./css/uploadScore.module.css";
import { Checkbox, Button } from "@mantine/core";

const Management = ({ data }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSidebar } = useContext(ShowSidebarContext);
  const [isShowTable, setIsShowTable] = useState(false);
  const [dataTable, setDataTable] = useState();
  const [isSelectedSec, setIsSelectSec] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [countChecked, setCountChecked] = useState(0);

  const showTable = (sec) => {
    searchParams.set("section", sec);
    setSearchParams(searchParams);
    setIsSelectSec(true);
    setIsShowTable(true);
    setDataTable(data.filter((e) => e.section === sec)[0].scores);
  };

  useEffect(() => {
    const fetchData = async () => {
      const resp = await getScores();
      if (resp) {
        resp.map((data) => {
          if (data.courseNo === searchParams.get("courseNo")) {
            console.log(data.sections);
            let sections = data.sections;
            setSections(sections);
          }
        });
      }
    };
    fetchData();

    data.sort((a, b) => a.section - b.section);
  }, [data, searchParams, setSections]);

  const handlePublishAllClick = () => {
    setShowPopup2(true);
  };

  const handlePublishEachClick = () => {
    setShowPopup(true);
  };

  const handleCheckboxChange = (e) => {
    if (e.target.checked === true) {
      setCountChecked(countChecked + 1);
    } else {
      setCountChecked(countChecked - 1);
    }
  };

  const handleButtonClick = () => {
    if (countChecked !== 0) {
      setShowPopup(false);
    }
  };

  const submitPublishAll = async () => {
    const student_schema = {
      courseNo: searchParams.get("courseNo"),
      year: parseInt(searchParams.get("year")),
      semester: parseInt(searchParams.get("semester")),
      sections: sections,
      type: "publish_many",
    };
    console.log("send", student_schema);
    let resp_student = await addStudentGrade(student_schema);
    if (resp_student) console.log("response: ", resp_student);
  };

  const submitPublishEach = async () => {
    const student_schema = {
      courseNo: searchParams.get("courseNo"),
      year: searchParams.get("year"),
      semester: searchParams.get("semester"),
      sections: sections,
      type: "publish_each",
    };
    console.log("send", student_schema);
    let resp_student = await addStudentGrade(student_schema);
    if (resp_student) console.log("response: ", resp_student);
  };

  return (
    <>
      {showPopup && (
        <div className={secMan.managePopup}>
          <div className={secMan.managePopupContent}>
            <div className={secMan.managePopupContentInner}>
              <p style={{ color: "white", fontWeight: "600" }}>
                Select section to publish
              </p>
            </div>

            <div>
              {data.map((e, key) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-22px",
                  }}
                >
                  <Checkbox
                    color="indigo"
                    size="md"
                    onChange={handleCheckboxChange}
                  />
                  <p style={{ marginLeft: "8px", fontSize: "21px" }}>
                    Section{" "}
                    {e.section < 100
                      ? `00${e.section}`
                      : e.section < 1000
                      ? `0${e.section}`
                      : e.section}
                  </p>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "15px",
              }}
            >
              <Button
                style={{ marginRight: "20px" }}
                className={Course.CancelPopupButton}
                onClick={() => setShowPopup(false)}
                radius="md"
                sx={{
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#F0EAEA",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                style={{ marginLeft: "20px" }}
                className={Course.AddPopupButton}
                type="submit"
                sx={{
                  "&:hover": {
                    backgroundColor: "#d499ff",
                  },
                }}
                onClick={handleButtonClick}
                radius="md"
                disabled={countChecked === 0}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
      {showPopup2 && (
        <div className={secMan.managePopup}>
          <div className={secMan.managePopupContent}>
            <div className={secMan.managePopupContentInner}>
              <p style={{ color: "white", fontWeight: "600" }}>
                Publish All Sections?
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
            <p>All scores will be published</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Button
                style={{ marginRight: "20px" }}
                className={Course.CancelPopupButton}
                onClick={() => setShowPopup2(false)}
                radius="md"
                sx={{
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#F0EAEA",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                style={{ marginLeft: "20px" }}
                className={Course.AddPopupButton}
                type="submit"
                sx={{
                  "&:hover": {
                    backgroundColor: "#d499ff",
                  },
                }}
                onClick={() => setShowPopup2(false)}
                radius="md"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
      <div
        className={` ${secMan.Managecourseframewindow}  ${
          showSidebar ? secMan.shrink : ""
        }`}
      >
        {!isShowTable && (
          <div>
            {data.map((e, key) => (
              <p
                className={secMan.secBox}
                key={key}
                onClick={() => {
                  showTable(e.section);
                }}
              >
                Section{" "}
                {e.section < 100
                  ? `00${e.section}`
                  : e.section < 100
                  ? `0${e.section}`
                  : e.section}
              </p>
            ))}
          </div>
        )}
        <div className={secMan.frameTableSc }>
          {isShowTable && <TableScore data={dataTable} />}
        </div>
       
      </div>

      {!isSelectedSec && (
        <div
          className={`${secMan.publishSec} ${showSidebar ? secMan.shrink : ""}`}
        >
          <div className={secMan.publishlEach} onClick={handlePublishEachClick}>
            <p className={secMan.fontp} style={{ fontWeight: "600" }}>
              Publish Each Section
            </p>
          </div>
          <div className={secMan.publishlAll} onClick={handlePublishAllClick}>
            <p
              className={secMan.fontp}
              style={{ fontWeight: "600", textDecoration: "underline" }}
            >
              Publish All Sections
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Management;
