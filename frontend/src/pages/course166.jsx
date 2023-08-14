import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Course from "./css/course166.module.css";
import SideBar from "../components/SideBar";
import DropDown from "../components/DropDown";
import UploadSc from "../components/uploadScore";
import { ShowSidebarContext } from "../context";
import { getCourse } from "../services/course";
import { getScores } from "../services/scores";

export default function Course166Container() {
  const [course, setCourse] = useState();
  const [searchParams, setSearchParams] = useSearchParams({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);
  const [isSelectedCourse, setSelectedCourse] = useState(false);
  const [isShowTableScore, setShowTableScore] = useState(null);
  const [isUploadScore, setUploadScore] = useState(false);

  const { showSidebar, handleSidebarClick } = useContext(ShowSidebarContext);

  const navigate = useNavigate();
  const location = useLocation();

  const onClickCourse = (item) => {
    let courseNo = item.courseNo;
    setShowTableScore(courseNo);
    setSelectedCourse(true);
    searchParams.set("courseNo", courseNo);
    setSearchParams(searchParams);
  };

  const onClickUplioad = () => {
    setUploadScore(true);
  };
  const onClickCourseNum = () => {
    setUploadScore(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const allCourse = await getCourse();
      const resp = await getScores();
      if (resp) {
        const data = resp.filter(
          (item) =>
            item.year === parseInt(params.year) &&
            item.semaster === parseInt(params.semaster)
        );
        data.forEach((e, index) => {
          allCourse.courseDetails.forEach((all) => {
            if (e.courseNo === all.courseNo) {
              console.log(data[index]);
              data[index].courseName = all.courseNameEN;
            }
          });
        });
        setCourse(data);
      }
    };

    if (params.courseNo == null && isSelectedCourse == true) {
      setSelectedCourse(false)
    }

    fetchData();

    if (searchParams.get("semaster") != null) handleRequest();

    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [location, isShowTableScore, searchParams]);

  // Function to format the date as "XX Aug, 20XX"
  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleRequest = () => {
    if (searchParams.get("courseNo") == null) {
      let semaster = searchParams.get("semaster");
      let year = searchParams.get("year");
      let courseTopic = document.getElementById("courseTopic");
      if (courseTopic) {
        courseTopic.innerHTML = `Course ${semaster}/${year.slice(2, 4)}`;
      }
    }
  };

  const params = {
    semaster: searchParams.get("semaster"),
    year: searchParams.get("year"),
    courseNo: searchParams.get("courseNo"),
    section: searchParams.get("section"),
  };

  function goToNav() {
    let url = `semaster=${params.semaster}&year=${params.year}&courseNo=${params.courseNo}&section=${params.section}`;
    navigate("/upload-score-page?" + url);
  }

  const handleAddCourse = () => {
    navigate("/search-course");
  };

  return (
    <>
      <SideBar />

      {isSelectedCourse ? null : (
        <div>
          <div
            className={`${Course.coursetopictext} ${
              showSidebar ? Course.moveRight : ""
            }`}
            onClick={handleSidebarClick}
          >
            <label id="courseTopic"></label>
          </div>
          <div
            className={` ${Course.datetext} ${
              showSidebar ? Course.moveRight : ""
            }`}
            onClick={handleSidebarClick}
          >
            {formatDate(currentDate)}
          </div>
          <div
            className={Course.AddCourseButton}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 30 29"
                fill="none"
              >
                <path
                  d="M29.8438 14.5C29.8438 14.96 29.6561 15.4011 29.322 15.7264C28.988 16.0516 28.5349 16.2344 28.0625 16.2344H16.7812V27.2188C16.7812 27.6787 16.5936 28.1199 16.2595 28.4451C15.9255 28.7704 15.4724 28.9531 15 28.9531C14.5276 28.9531 14.0745 28.7704 13.7405 28.4451C13.4064 28.1199 13.2188 27.6787 13.2188 27.2188V16.2344H1.9375C1.46508 16.2344 1.01202 16.0516 0.677966 15.7264C0.343917 15.4011 0.15625 14.96 0.15625 14.5C0.15625 14.04 0.343917 13.5989 0.677966 13.2736C1.01202 12.9484 1.46508 12.7656 1.9375 12.7656H13.2188V1.78125C13.2188 1.32127 13.4064 0.88012 13.7405 0.554862C14.0745 0.229603 14.5276 0.046875 15 0.046875C15.4724 0.046875 15.9255 0.229603 16.2595 0.554862C16.5936 0.88012 16.7812 1.32127 16.7812 1.78125V12.7656H28.0625C28.5349 12.7656 28.988 12.9484 29.322 13.2736C29.6561 13.5989 29.8438 14.04 29.8438 14.5Z"
                  fill={isHovered ? "white" : "#8084C8"}
                />
              </svg>
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                textIndent: "35px",
              }}
              onClick={handleAddCourse}
            >
              Add Course
            </div>
          </div>
          <div
            className={`${Course.courseframewindow} ${
              showSidebar ? Course.shrink : ""
            }`}
            style={{ gap: 25 }}
          >
            {course &&
              course.map((item) => {
                return (
                  <div
                    key={item.courseNo}
                    className={Course.frameEachCourse}
                    onClick={() => onClickCourse(item)}
                  >
                    <div className={Course.courseName}>
                      {/* SVG icon */}
                      <div className={Course.intoCourse}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="23"
                          height="30"
                          viewBox="0 0 19 30"
                          fill="none"
                        >
                          <path
                            d="M19.8367 16.6865L6.61282 29.1352C5.69882 29.9956 4.22086 29.9956 3.31659 29.1352L1.11909 27.0665C0.205094 26.2061 0.205094 24.8148 1.11909 23.9635L10.4925 15.1396L1.11909 6.31575C0.205094 5.45534 0.205094 4.06402 1.11909 3.21276L3.30686 1.12578C4.22086 0.265364 5.69882 0.265364 6.6031 1.12578L19.8269 13.5744C20.7507 14.4348 20.7507 15.8261 19.8367 16.6865Z"
                            fill="white"
                          />
                        </svg>
                        {item.courseNo} - {item.courseName}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {isSelectedCourse && (
        <div className={Course.MenuIndexLayout}>
          <>
            <div className={Course.MenuNavigate}>
              <p className={Course.MenuIndex}>
                <div 
                onClick={()=>setSelectedCourse(false)}
                >course {params.semaster}/{params.year.slice(2)}</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none"
                >
                  <path
                    d="M7.43738 6.41702L2.36856 11.3462C2.01821 11.6869 1.4517 11.6869 1.10508 11.3462L0.262759 10.5271C-0.0875863 10.1864 -0.0875863 9.63549 0.262759 9.29842L3.85566 5.80449L0.262759 2.31056C-0.0875863 1.96987 -0.0875863 1.41896 0.262759 1.08189L1.10135 0.255521C1.4517 -0.0851736 2.01821 -0.0851736 2.36483 0.255521L7.43365 5.18472C7.78773 5.52541 7.78773 6.07632 7.43738 6.41702Z"
                    fill="#696CA3"
                  />
                </svg>
                {params.courseNo}
                {/* {isShowTableScore} */}
              </p>
              {isUploadScore && (
                <p className={Course.MenuIndex}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                  >
                    <path
                      d="M7.43738 6.41702L2.36856 11.3462C2.01821 11.6869 1.4517 11.6869 1.10508 11.3462L0.262759 10.5271C-0.0875863 10.1864 -0.0875863 9.63549 0.262759 9.29842L3.85566 5.80449L0.262759 2.31056C-0.0875863 1.96987 -0.0875863 1.41896 0.262759 1.08189L1.10135 0.255521C1.4517 -0.0851736 2.01821 -0.0851736 2.36483 0.255521L7.43365 5.18472C7.78773 5.52541 7.78773 6.07632 7.43738 6.41702Z"
                      fill="#696CA3"
                    />
                  </svg>
                  Upload Score
                </p>
              )}
            </div>
            <div className={Course.lineIndex}></div>
          </>
          <div className={Course.ButtonTitleLayout}>
            <div className={Course.TitleLayout}>
              <div
                className={`${Course.Title} ${
                  showSidebar ? Course.moveRight : ""
                }`}
                onClick={handleSidebarClick}
              >
                {isUploadScore ? "Upload Score " : ""}
                {isShowTableScore}
              </div>
              <div
                className={` ${Course.Date} ${
                  showSidebar ? Course.moveRight : ""
                }`}
                onClick={handleSidebarClick}
              >
                {formatDate(currentDate)}
              </div>
            </div>

            {isUploadScore ? (
              <div className={Course.showUpload}>
                <UploadSc />
              </div>
            ) : (
              <div>
                <div className={Course.boxdrop}>
                  <div
                    className={`${Course.box_upload} ${Course.font}`}
                    onClick={onClickUplioad}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M18.5714 11.4286H11.4286V18.5714C11.4286 18.9503 11.2781 19.3137 11.0102 19.5816C10.7422 19.8495 10.3789 20 10 20C9.62112 20 9.25776 19.8495 8.98985 19.5816C8.72194 19.3137 8.57143 18.9503 8.57143 18.5714V11.4286H1.42857C1.04969 11.4286 0.686328 11.2781 0.418419 11.0102C0.15051 10.7422 0 10.3789 0 10C0 9.62112 0.15051 9.25776 0.418419 8.98985C0.686328 8.72194 1.04969 8.57143 1.42857 8.57143H8.57143V1.42857C8.57143 1.04969 8.72194 0.686328 8.98985 0.418418C9.25776 0.150509 9.62112 0 10 0C10.3789 0 10.7422 0.150509 11.0102 0.418418C11.2781 0.686328 11.4286 1.04969 11.4286 1.42857V8.57143H18.5714C18.9503 8.57143 19.3137 8.72194 19.5816 8.98985C19.8495 9.25776 20 9.62112 20 10C20 10.3789 19.8495 10.7422 19.5816 11.0102C19.3137 11.2781 18.9503 11.4286 18.5714 11.4286Z"
                        fill="#696CA3"
                      />
                    </svg>
                    <p onClick={goToNav}>Upload Score</p>
                  </div>
                  <DropDown />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
