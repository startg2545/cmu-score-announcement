import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Course from "./css/course166.module.css";
import { SideBar, TableScore, UploadSc } from "../components";
import { ShowSidebarContext } from "../context";
import { addCourse, getAllCourses, getScores } from "../services";
import DropDownCourse from "../components/DropDownCourse";
import { TextInput, Button, Flex, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAt } from "@tabler/icons-react";
import Management from "../components/management";

export default function Course166Container() {
  const [course, setCourse] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);
  const [isSelectedCourse, setSelectedCourse] = useState(false);
  const [isShowTableScore, setShowTableScore] = useState(false);
  const [isUploadScore, setUploadScore] = useState(false);
  const [isManage, setManage] = useState(false);
  const [showPopupAddCourse, setShowPopupAddCourse] = useState(false);
  const [params, setParams] = useState({});
  const [section, setSections] = useState([]);
  const [tableData, setTableData] = useState();
  const [isCourseNoValid, setIsCourseNoValid] = useState(true);
  const [isEmailValid, setIsEmailNoValid] = useState(true);

  const { showSidebar } = useContext(ShowSidebarContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [showPopup, setShowPopup] = useState(false);

  const showSection = () => {
    const data = course.filter(
      (e) => e.courseNo === searchParams.get("courseNo")
    )[0].sections;
    setSections(data);
    setManage(true);
    setShowTableScore(false);
    setUploadScore(false);
  };

  const handleClickInstructor = () => {
    setShowPopup(true);
  };

  const instructorClosePopup = () => {
    if (!isEmailValid) {
      return;
    }
    setShowPopup(false);
    emailform.reset();
  };

  const instructorCancelClosePopup = () => {
    setShowPopup(false);
    emailform.reset();
  };

  const emailform = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => {
        if (!value) {
          setIsEmailNoValid(false);
          return "Email is required";
        }
        const isValid = /^\S+@cmu\.ac\.th$/i.test(value);
        setIsEmailNoValid(isValid);
        return isValid
          ? null
          : "Please enter a valid email address ending with @cmu.ac.th";
      },
    },
    // validateInputOnChange: true,
    validateInputOnBlur: true,
  });

  const courseForm = useForm({
    initialValues: {
      courseNo: "",
    },
    validate: {
      courseNo: (value) => {
        if (!value) {
          setIsCourseNoValid(false);
          return "Course no is required";
        }
        const isValid = /^\d{6}$/.test(value);
        setIsCourseNoValid(isValid);
        return isValid ? null : "Please enter a valid course no";
      },
    },
    validateInputOnBlur: true,
  });

  const getParams = useMemo(() => {
    setParams({
      semester: searchParams.get("semester"),
      year: searchParams.get("year"),
      courseNo: searchParams.get("courseNo"),
    });
  }, [searchParams]);

  const onClickCourse = (item) => {
    let courseNo = item.courseNo;
    setUploadScore(false);
    setManage(false);
    setSelectedCourse(true);
    searchParams.set("courseNo", courseNo);
    setSearchParams(searchParams);
  };

  const backToDashboard = () => {
    setUploadScore(false);
    setManage(false);
    setSelectedCourse(false);
    searchParams.delete("courseNo");
    setSearchParams(searchParams);
  };

  const backToCourse = () => {
    setUploadScore(false);
    setManage(false);
  };

  const fetchData = async () => {
    const allCourse = await getAllCourses();
    setAllCourses(allCourse);
    const resp = await getScores();
    if (resp) {
      const data = resp.filter(
        (item) =>
          item.year === parseInt(params.year) &&
          item.semester === parseInt(params.semester)
      );
      if (allCourse.ok) {
        data.forEach((e, index) => {
          allCourse.courseDetails.forEach((all) => {
            if (e.courseNo === all.courseNo) {
              data[index].courseName = all.courseNameEN;
            }
          });
        });
      }
      setCourse(data);
    }
  };

  useEffect(() => {
    if (isUploadScore === true) {
      document.getElementById("tab-menu").style.cursor = "pointer";
    }

    if (!showPopupAddCourse) fetchData();

    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [
    location,
    isShowTableScore,
    searchParams,
    showPopupAddCourse,
    getParams,
    params,
    setSearchParams,
    isUploadScore,
  ]);

  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const goToUpload = () => {
    setUploadScore(true);
    setManage(false);
    setShowTableScore(false);
  };

  const goToManage = () => {
    setManage(true);
    setUploadScore(false);
  };

  const handleAddCourse = () => {
    searchParams.delete("courseNo");
    setSearchParams(searchParams);
    setShowPopupAddCourse(true);
  };

  const CancelhandleClosePopup = () => {
    searchParams.delete("courseNo");
    setSearchParams(searchParams);
    setShowPopupAddCourse(false);
    courseForm.reset();
  };

  const ConfirmhandleClosePopup = async (data) => {
    await addCourse({
      year: parseInt(params.year),
      semester: parseInt(params.semester),
      courseNo: params.courseNo ? params.courseNo : data.courseNo,
    });
    setShowPopupAddCourse(false);
    courseForm.reset();
    fetchData();
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
          >
            <div>
              Course {params.semester}/
              {params.year ? params.year.slice(2) : params.year}
            </div>
          </div>
          <div
            className={` ${Course.datetext} ${
              showSidebar ? Course.moveRight : ""
            }`}
          >
            {formatDate(currentDate)}
          </div>
          <div
            className={Course.AddCourseButton}
            onClick={handleAddCourse}
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
            >
              Add Course
            </div>
          </div>
          {showPopupAddCourse && (
            <form
              onSubmit={courseForm.onSubmit((data) => {
                console.log(data);
                ConfirmhandleClosePopup(data);
              })}
            >
              <div className={Course.AddCoursePopup}>
                <div className={Course["AddCoursePopup-Content"]}>
                  <div className={Course["AddCoursePopup-ContentInner"]}>
                    <p style={{ color: "white", fontWeight: "600" }}>
                      Add Course
                    </p>
                  </div>
                  <div className={Course.AddCourseInlineContainer}>
                    <p
                      style={{
                        marginRight: "20px",
                        fontSize: "28px",
                        transform: "translateY(-5px)",
                      }}
                    >
                      Course:
                    </p>
                    <div className={Course.DropDownContainer}>
                      <DropDownCourse parentToChild={allCourses} />
                    </div>
                  </div>
                  <div className={Course.AddCourseInlineContainer}>
                    <Flex mt={-20}>
                      <Text fz={28}>or</Text>
                      <TextInput
                        placeholder="Type Course No"
                        {...courseForm.getInputProps("courseNo")}
                        mt={5}
                        size="md"
                        ml={90}
                        radius="md"
                      />
                    </Flex>
                  </div>
                  <div className={Course.AddCoursePopupButtons}>
                    <Button
                      className={Course.AddCourseCancelButton}
                      onClick={CancelhandleClosePopup}
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
                      className={Course.AddCourseConfirmButton}
                      type="submit"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}
          <div
            className={`${Course.courseframewindow} ${
              showSidebar ? Course.shrink : ""
            }`}
            style={{ gap: 25 }}
          >
            {course &&
              course.map((item, key) => {
                return (
                  <div
                    key={key}
                    className={Course.frameEachCourse}
                    onClick={() => onClickCourse(item)}
                  >
                    <div className={Course.courseName}>
                      <div className={Course.intoCourse}>
                        {item.courseNo}
                        {item.courseName ? ` - ${item.courseName}` : null}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {showPopup && (
        <div className={Course.ScorePopup}>
          <div className={Course["ScorePopup-Content"]}>
            <div className={Course["ScorePopup-ContentInner"]}>
              <p style={{ color: "white", fontWeight: "600" }}>
                {`Add Co-Instructor ${params.courseNo}`}
              </p>
            </div>
            <p
              style={{
                marginTop: "-10px",
                fontSize: "15px",
                color: "#676666",
                fontFamily: "SF Pro",
              }}
            >
              Co-Instructors have full access to edit and change scores in all
              documents. Input an email with the domain cmu.ac.th to invite.
            </p>
            <form
              onSubmit={emailform.onSubmit((data) => {
                console.log(data);
                instructorClosePopup();
              })}
            >
              <TextInput
                placeholder="Type email to add co-instructor"
                className={Course.instructorNameInput}
                fs={20}
                w={450}
                mt={5}
                radius="md"
                ta="center"
                icon={<IconAt size="1.1rem" />}
                {...emailform.getInputProps("email")}
              />
              <Flex className={Course.instructorPopupButtons}>
                <Button
                  className={Course.CancelPopupButton}
                  onClick={instructorCancelClosePopup}
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
                  className={Course.AddPopupButton}
                  type="submit"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#d499ff",
                    },
                  }}
                >
                  Add
                </Button>
              </Flex>
            </form>
          </div>
        </div>
      )}

      {isSelectedCourse && (
        <div className={Course.MenuIndexLayout}>
          <>
            <div className={Course.MenuNavigate}>
              <p className={Course.MenuIndex}>
                <label
                  onClick={backToDashboard}
                  style={{ cursor: "pointer" }}
                  className={` ${Course.date} ${
                    showSidebar ? Course.moveRight : ""
                  }`}
                >
                  Course {params.semester}/{params.year.slice(2)}
                </label>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none"
                  className={` ${Course.date} ${
                    showSidebar ? Course.moveRight : ""
                  }`}
                >
                  <path
                    d="M7.43738 6.41702L2.36856 11.3462C2.01821 11.6869 1.4517 11.6869 1.10508 11.3462L0.262759 10.5271C-0.0875863 10.1864 -0.0875863 9.63549 0.262759 9.29842L3.85566 5.80449L0.262759 2.31056C-0.0875863 1.96987 -0.0875863 1.41896 0.262759 1.08189L1.10135 0.255521C1.4517 -0.0851736 2.01821 -0.0851736 2.36483 0.255521L7.43365 5.18472C7.78773 5.52541 7.78773 6.07632 7.43738 6.41702Z"
                    fill="#696CA3"
                  />
                </svg>
                <label
                  onClick={backToCourse}
                  id="tab-menu"
                  className={` ${Course.date} ${
                    showSidebar ? Course.moveRight : ""
                  }`}
                >
                  {params.courseNo}
                </label>
              </p>
              <div
                className={`${Course.frameCourseDash} ${
                  showSidebar ? Course.shrink : ""
                }`}
              >
                <div
                  className={`${Course.navbarCourseDash} ${
                    showSidebar ? Course.shrink : ""
                  }`}
                >
                  <div className=" containerTitleDate">
                    <div
                      className={`${Course.Title} ${
                        showSidebar ? Course.moveRight : ""
                      }`}
                    >
                      {isSelectedCourse &&
                        !isManage &&
                        !isUploadScore &&
                        params.courseNo}
                      {isUploadScore &&
                        !isManage &&
                        `Upload Score ${params.courseNo}`}
                      {isManage && `Management ${params.courseNo}`}
                      {/* {isShowTableScore && <TableScore data={tableData} />} */}
                    </div>
                    <div
                      className={` ${Course.Date} ${
                        showSidebar ? Course.moveRight : ""
                      }`}
                    >
                      {formatDate(currentDate)}
                    </div>
                  </div>

                  {/*button choice addCo/Upload/Manage */}
                  <div className="button-container">
                    <div
                      className={` ${Course.instructorButton} ${
                        showSidebar ? Course.moveLeft : ""
                      }`}
                      onMouseEnter={() => setIsHovered3(true)}
                      onMouseLeave={() => setIsHovered3(false)}
                      onClick={handleClickInstructor}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                      >
                        <path
                          d="M17.75 18.75H17.5913C17.4041 17.8385 17.0745 17.0003 16.6025 16.2354C16.1305 15.4704 15.5568 14.8112 14.8813 14.2578C14.2059 13.7044 13.445 13.2731 12.5986 12.9639C11.7523 12.6546 10.8652 12.5 9.9375 12.5C9.22135 12.5 8.52962 12.5936 7.8623 12.7808C7.19499 12.9679 6.57243 13.2284 5.99463 13.562C5.41683 13.8957 4.89193 14.3026 4.41992 14.7827C3.94792 15.2629 3.54102 15.7918 3.19922 16.3696C2.85742 16.9474 2.59294 17.57 2.40576 18.2373C2.21859 18.9046 2.125 19.5964 2.125 20.3125H0.5625C0.5625 19.3359 0.704915 18.396 0.989746 17.4927C1.27458 16.5894 1.68555 15.7552 2.22266 
                    14.9902C2.75977 14.2253 3.39453 13.5457 4.12695 12.9517C4.85938 12.3576 5.68945 11.8896 6.61719 11.5479C5.69759 10.9456 4.98145 10.1888 4.46875 9.27734C3.95605 8.36589 3.69564 7.35677 3.6875 6.25C3.6875 5.38737 3.85026 4.57764 4.17578 3.8208C4.5013 3.06396 4.94482 2.40072 5.50635 1.83105C6.06787 1.26139 6.73112 0.813802 7.49609 0.488281C8.26107 0.16276 9.07487 0 9.9375 0C10.8001 0 11.6099 0.16276 12.3667 0.488281C13.1235 0.813802 13.7868 1.25732 14.3564 1.81885C14.9261 2.38037 15.3737 3.04362 15.6992 3.80859C16.0247 
                    4.57357 16.1875 5.38737 16.1875 6.25C16.1875 6.78711 16.1224 7.31201 15.9922 7.82471C15.862 8.3374 15.6667 8.82161 15.4062 9.27734C15.1458 9.73307 14.8407 10.1522 14.4907 10.5347C14.1408 10.9172 13.7298 11.2549 13.2578 11.5479C14.1693 11.8978 15.0075 12.3779 15.7725 12.9883C16.5374 13.5986 17.1966 14.3148 17.75 15.1367V18.75ZM5.25 6.25C5.25 6.90104 5.37207 7.50732 5.61621 8.06885C5.86035 8.63037 6.19401 9.12679 6.61719 9.55811C7.04036 9.98942 7.53678 10.3271 8.10645 10.5713C8.67611 10.8154 9.28646 10.9375 9.9375 10.9375C10.5804 10.9375 11.1867 10.8154 11.7563 10.5713C12.326 10.3271 12.8224 9.99349 13.2456 9.57031C13.6688 9.14714 14.0065 8.65072 14.2588 8.08105C14.5111 7.51139 14.6331 6.90104 14.625 6.25C14.625 5.6071 14.5029 5.00081 14.2588 4.43115C14.0146 3.86149 13.681 3.36507 13.2578 2.94189C12.8346 2.51872 12.3341 2.18099 11.7563 1.92871C11.1785 1.67643 10.5723 1.55436 9.9375 1.5625C9.28646 1.5625 8.68018 1.68457 8.11865 1.92871C7.55713 2.17285 7.06071 2.50651 6.62939 2.92969C6.19808 3.35286 5.86035 3.85335 5.61621 4.43115C5.37207 
                    5.00895 5.25 5.61523 5.25 6.25ZM20.875 20.3125H24V21.875H20.875V25H19.3125V21.875H16.1875V20.3125H19.3125V17.1875H20.875V20.3125Z"
                          fill={isHovered3 ? "black" : "#ffffff"}
                        />
                      </svg>
                      <p>Instructor</p>
                    </div>

                    <div
                      className={` ${Course.box_upload} ${
                        showSidebar ? Course.moveLeft : ""
                      }`}
                      onClick={() => {
                        setUploadScore(true);
                        setShowTableScore(false);
                        document.getElementById("tab-menu").style.cursor =
                          "pointer";
                        goToUpload();
                      }}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      style={{
                        boxShadow:
                          isUploadScore && !isManage
                            ? "0px 4px 4px 0px rgba(0, 0, 0, 0.55) inset"
                            : "",
                        backgroundColor:
                          isUploadScore && !isManage ? "white" : "",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 30 29"
                        fill="none"
                      >
                        <path
                          d="M29.8438 14.5C29.8438 14.96 29.6561 15.4011 29.322 15.7264C28.988 16.0516 28.5349 16.2344 28.0625 16.2344H16.7812V27.2188C16.7812 27.6787 16.5936 28.1199 16.2595 28.4451C15.9255 28.7704 15.4724 28.9531 15 28.9531C14.5276 28.9531 14.0745 28.7704 13.7405 28.4451C13.4064 28.1199 13.2188 27.6787 13.2188 27.2188V16.2344H1.9375C1.46508 16.2344 1.01202 16.0516 0.677966 15.7264C0.343917 15.4011 0.15625 14.96 0.15625 14.5C0.15625 14.04 0.343917 13.5989 0.677966 13.2736C1.01202 12.9484 1.46508 12.7656 1.9375 12.7656H13.2188V1.78125C13.2188 1.32127 13.4064 0.88012 13.7405 0.554862C14.0745 0.229603 14.5276 0.046875 15 0.046875C15.4724 0.046875 15.9255 0.229603 16.2595 0.554862C16.5936 0.88012 16.7812 1.32127 16.7812 1.78125V12.7656H28.0625C28.5349 12.7656 28.988 12.9484 29.322 13.2736C29.6561 13.5989 29.8438 14.04 29.8438 14.5Z"
                          fill={
                            isHovered
                              ? "black"
                              : isUploadScore && !isManage
                              ? "black"
                              : "#ffffff"
                          }
                        />
                      </svg>
                      <p
                        style={{
                          color: isUploadScore && !isManage ? "black" : "",
                        }}
                      >
                        Upload Score
                      </p>
                    </div>
                    {/* {isShowTableScore && <TableScore data={section} />} */}

                    <div
                      className={` ${Course.manageButton} ${
                        showSidebar ? Course.moveLeft : ""
                      }`}
                      onMouseEnter={() => setIsHovered2(true)}
                      onMouseLeave={() => setIsHovered2(false)}
                      style={{
                        boxShadow: isManage
                          ? "0px 4px 4px 0px rgba(0, 0, 0, 0.55) inset"
                          : "",
                        backgroundColor: isManage ? "white" : "",
                      }}
                      onClick={() => {
                        setManage(true);
                        document.getElementById("tab-menu").style.cursor =
                          "pointer";
                        goToManage();
                        showSection();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M19.8999 12.6604C19.7396 12.4779 19.6512 12.2433 19.6512 12.0004C19.6512 11.7575 19.7396 11.5229 19.8999 11.3404L21.1799 9.90038C21.3209 9.74305 21.4085 9.54509 21.4301 9.33489C21.4516 9.12469 21.4061 8.91307 21.2999 8.73038L19.2999 5.27038C19.1948 5.0879 19.0348 4.94326 18.8426 4.85707C18.6505 4.77088 18.4361 4.74754 18.2299 4.79038L16.3499 5.17038C16.1107 5.21981 15.8616 5.17997 15.6498 5.05838C15.4379 4.93679 15.2779 4.74187 15.1999 4.51038L14.5899 2.68038C14.5228 2.48176 14.395 2.30925 14.2245 2.18723C14.0541 2.0652 13.8495 1.99984 13.6399 2.00038H9.6399C9.42183 1.989 9.20603 2.04931 9.02546 2.1721C8.84489 2.29489 8.70948 2.4734 8.6399 2.68038L8.0799 4.51038C8.0019 4.74187 7.84187 4.93679 7.63001 5.05838C7.41815 5.17997 7.16911 5.21981 6.9299 5.17038L4.9999 4.79038C4.80445 4.76276 4.6052 4.79361 4.42724 4.87902C4.24929 4.96444 4.1006 5.10061 3.9999 5.27038L1.9999 8.73038C1.89106 8.91103 1.84212 9.12147 1.86008 9.33161C1.87804 9.54174 1.96198 9.74082 2.0999 9.90038L3.3699 11.3404C3.53022 11.5229 3.61863 11.7575 3.61863 12.0004C3.61863 12.2433 3.53022 12.4779 3.3699 12.6604L2.0999 14.1004C1.96198 14.2599 1.87804 14.459 1.86008 14.6692C1.84212 14.8793 1.89106 15.0897 1.9999 15.2704L3.9999 18.7304C4.10499 18.9129 4.26502 19.0575 4.45715 19.1437C4.64928 19.2299 4.86372 19.2532 5.0699 19.2104L6.9499 18.8304C7.18911 18.781 7.43815 18.8208 7.65001 18.9424C7.86187 19.064 8.0219 19.2589 8.0999 19.4904L8.7099 21.3204C8.77948 21.5274 8.91489 21.7059 9.09546 21.8287C9.27603 21.9515 9.49183 22.0118 9.7099 22.0004H13.7099C13.9195 22.0009 14.1241 21.9356 14.2945 21.8135C14.465 21.6915 14.5928 21.519 14.6599 21.3204L15.2699 19.4904C15.3479 19.2589 15.5079 19.064 15.7198 18.9424C15.9316 18.8208 16.1807 18.781 16.4199 18.8304L18.2999 19.2104C18.5061 19.2532 18.7205 19.2299 18.9126 19.1437C19.1048 19.0575 19.2648 18.9129 19.3699 18.7304L21.3699 15.2704C21.4761 15.0877 21.5216 14.8761 21.5001 14.6659C21.4785 14.4557 21.3909 14.2577 21.2499 14.1004L19.8999 12.6604ZM18.4099 14.0004L19.2099 14.9004L17.9299 17.1204L16.7499 16.8804C16.0297 16.7332 15.2805 16.8555 14.6445 17.2242C14.0085 17.5929 13.53 18.1822 13.2999 18.8804L12.9199 20.0004H10.3599L9.9999 18.8604C9.76975 18.1622 9.29128 17.5729 8.6553 17.2042C8.01932 16.8355 7.27012 16.7132 6.5499 16.8604L5.3699 17.1004L4.0699 14.8904L4.8699 13.9904C5.36185 13.4404 5.63383 
                      12.7283 5.63383 11.9904C5.63383 11.2525 5.36185 10.5404 4.8699 9.99038L4.0699 9.09038L5.3499 6.89038L6.5299 7.13038C7.25012 7.27761 7.99932 7.15526 8.6353 6.78658C9.27128 6.4179 9.74975 5.82854 9.9799 5.13038L10.3599 4.00038H12.9199L13.2999 5.14038C13.53 5.83854 14.0085 6.4279 14.6445 6.79658C15.2805 7.16526 16.0297 7.28761 16.7499 7.14038L17.9299 6.90038L19.2099 9.12038L18.4099 10.0204C17.9235 10.5691 17.6549 11.2771 17.6549 12.0104C17.6549 12.7437 17.9235 13.4516 18.4099 14.0004ZM11.6399 8.00038C10.8488 8.00038 10.0754 8.23498 9.41761 8.67451C8.75982 9.11403 8.24713 9.73874 7.94438 10.4696C7.64163 11.2006 7.56241 12.0048 7.71675 12.7807C7.8711 13.5567 8.25206 14.2694 8.81147 14.8288C9.37088 15.3882 10.0836 15.7692 10.8595 15.9235C11.6355 16.0779 12.4397 15.9987 13.1706 15.6959C13.9015 15.3932 14.5262 14.8805 14.9658 14.2227C15.4053 13.5649 15.6399 12.7915 15.6399 12.0004C15.6399 10.9395 15.2185 9.9221 14.4683 9.17196C13.7182 8.42181 12.7008 8.00038 11.6399 8.00038ZM11.6399 14.0004C11.2443 14.0004 10.8577 13.8831 10.5288 13.6633C10.1999 13.4436 9.94351 13.1312 9.79214 12.7657C9.64076 12.4003 9.60116 11.9982 9.67833 11.6102C9.7555 11.2222 9.94598 10.8659 10.2257 10.5862C10.5054 10.3065 10.8618 10.116 11.2497 10.0388C11.6377 9.96164 12.0398 10.0012 12.4053 10.1526C12.7707 10.304 13.0831 10.5603 13.3028 10.8892C13.5226 11.2181 13.6399 11.6048 13.6399 12.0004C13.6399 12.5308 13.4292 13.0395 13.0541 13.4146C12.679 13.7897 12.1703 14.0004 11.6399 14.0004Z"
                          fill={
                            isHovered2
                              ? "black"
                              : isManage
                              ? "black"
                              : "#ffffff"
                          }
                        />
                      </svg>
                      <p style={{ color: isManage ? "black" : "" }}>
                        Management
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    height: "calc(87vh - 60px)",
                    width: "100vw",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  {!isUploadScore && !isManage && (
                    <p
                      style={{
                        fontSize: "30px",
                        textAlign: "center",
                        alignItems: "center",
                        fontStyle: "normal",
                        color: "#696CA3",
                        fontWeight: "590",
                        fontFamily: "SF Pro",
                      }}
                    >
                      Please select menu in the navigation bar
                    </p>
                  )}
                </div>
                {/* show Upload/Section/TableScore */}
                {isManage && <Management data={section} />}
                {/* {isManage &&
                     <div
                     className={`${Course.publishSec} ${
                       showSidebar ? Course.shrink : ""
                     }`}
                   >
                     <div className={Course.publishlAll}>
                       <p>Publish All Sections</p>
                     </div>
                     <div className={Course.publishlEach}>
                       <p>Publish Each Section</p>
                     </div>
                   </div>
                } */}
               
              </div>

              {isUploadScore && !isManage && (
                <p className={Course.MenuIndex}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                    className={` ${Course.date} ${
                      showSidebar ? Course.moveRight : ""
                    }`}
                  >
                    <path
                      d="M7.43738 6.41702L2.36856 11.3462C2.01821 11.6869 1.4517 11.6869 1.10508 11.3462L0.262759 10.5271C-0.0875863 10.1864 -0.0875863 9.63549 0.262759 9.29842L3.85566 5.80449L0.262759 2.31056C-0.0875863 1.96987 -0.0875863 1.41896 0.262759 1.08189L1.10135 0.255521C1.4517 -0.0851736 2.01821 -0.0851736 2.36483 0.255521L7.43365 5.18472C7.78773 5.52541 7.78773 6.07632 7.43738 6.41702Z"
                      fill="#696CA3"
                    />
                  </svg>
                  <label
                    className={` ${Course.date} ${
                      showSidebar ? Course.moveRight : ""
                    }`}
                  >
                    Upload Score
                  </label>
                </p>
              )}
              {isManage && (
                <p className={Course.MenuIndex}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                    className={` ${Course.date} ${
                      showSidebar ? Course.moveRight : ""
                    }`}
                  >
                    <path
                      d="M7.43738 6.41702L2.36856 11.3462C2.01821 11.6869 1.4517 11.6869 1.10508 11.3462L0.262759 10.5271C-0.0875863 10.1864 -0.0875863 9.63549 0.262759 9.29842L3.85566 5.80449L0.262759 2.31056C-0.0875863 1.96987 -0.0875863 1.41896 0.262759 1.08189L1.10135 0.255521C1.4517 -0.0851736 2.01821 -0.0851736 2.36483 0.255521L7.43365 5.18472C7.78773 5.52541 7.78773 6.07632 7.43738 6.41702Z"
                      fill="#696CA3"
                    />
                  </svg>
                  <label
                    className={` ${Course.date} ${
                      showSidebar ? Course.moveRight : ""
                    }`}
                    onClick={showSection}
                    style={{ cursor: "pointer" }}
                  >
                    Management
                  </label>
                </p>
              )}
            </div>

            <div
              className={` ${Course.lineIndex} ${
                showSidebar ? Course.moveRight : ""
              }`}
            >
              {" "}
            </div>
          </>
          {isUploadScore && <UploadSc />}
        </div>
      )}
    </>
  );
}
