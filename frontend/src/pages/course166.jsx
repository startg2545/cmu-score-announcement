import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Course from "./css/course166.module.css";
import { UploadSc, Management } from "../components";
import { ShowSidebarContext } from "../context";
import {
  addCoInstructors,
  addCourse,
  getAllCourses,
  getScores,
} from "../services";
import { TextInput, Button, Flex, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconAt } from "@tabler/icons-react";
import { HiChevronRight } from "react-icons/hi";
import { FaChevronRight } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import { GoGear } from "react-icons/go";
import courseData from "./courseData";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "../services";

export default function Course166Container() {
  const [noCourse, setNoCourse] = useState();
  const [course, setCourse] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSelectedCourse, setSelectedCourse] = useState(false);
  const [isUploadScore, setUploadScore] = useState(false);
  const [isManage, setManage] = useState(false);
  const [params, setParams] = useState({});
  const [sections, setSections] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const { showSidebar, handleSidebarClick } = useContext(ShowSidebarContext);
  const [sidebar, setLgSidebar] = useState(false);
  const navigate = useNavigate();
  const addCourseButton = useDisclosure();

  const handleClickInstructor = () => {
    open();
  };

  const navToSemesterYear = (semester, year) => {
    navigate({
      pathname: "/course",
      search: `?semester=${semester}&year=${year}`,
    });
  };
  const handleSemesterYear = (semester, year) => {
    setLgSidebar(!sidebar);
    handleSidebarClick(true);
    navToSemesterYear(semester, year);
  };
  const instructorClosePopup = async (coInstructors) => {
    if (!isEmailValid) {
      return;
    }
    const data = {
      courseNo: params.courseNo,
      year: parseInt(params.year),
      semester: parseInt(params.semester),
      coInstructors: coInstructors,
    };
    const resp = await addCoInstructors(data);
    close();
    emailform.reset();
    return resp;
  };

  const emailform = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => {
        if (!value) {
          setIsEmailValid(false);
          return "Email is required";
        }
        const isValid = /^\S+@cmu\.ac\.th$/i.test(value);
        setIsEmailValid(isValid);
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
          return "Course no. is required";
        }
        const isValid = /^\d{6}$/.test(value);
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
    localStorage.removeItem("page");
    setUploadScore(false);
    setManage(false);
    setSelectedCourse(false);
    searchParams.delete("courseNo");
    searchParams.delete("section");
    setSearchParams(searchParams);
  };

  const backToCourse = () => {
    localStorage.removeItem("page");
    setUploadScore(false);
    setManage(false);
    searchParams.delete("section");
    setSearchParams(searchParams);
  };

  const backToSelectSec = () => {
    setCourse([]);
    setSections([]);
    fetchData();
    searchParams.delete("section");
    setSearchParams(searchParams);
  };

  const fetchData = async () => {
    const allCourses = await getAllCourses();
    const resp = await getScores(params.year, params.semester);
    if (resp.ok) {
      if (allCourses.ok) {
        resp.course.forEach((e, index) => {
          allCourses.courseDetails.forEach((all) => {
            if (e.courseNo === all.courseNo) {
              resp.course[index].courseName = all.courseNameEN;
            }
          });
        });
      }
      setCourse(resp.course);
    } else {
      setNoCourse(resp.message);
    }
  };

  const showSection = () => {
    const data = course
      .filter((e) => e.courseNo === params.courseNo)[0]
      .sections.filter((e) => e.section);
    setSections(data);
    setUploadScore(false);
    setManage(true);
  };

  useEffect(() => {
    setCourse([]);
    setNoCourse();
  }, [params.year, params.semester]);

  useEffect(() => {
    if (!searchParams.get("year") || !searchParams.get("semester")) {
      return navigate("/instructor-dashboard");
    }

    if (localStorage.getItem("delete score")) {
      setCourse([]);
      setNoCourse();
      setSections([]);
      localStorage.removeItem("delete score");
    }
    if (localStorage.getItem("publish score")) {
      setCourse([]);
      setNoCourse();
      setSections([]);
      localStorage.removeItem("publish score");
    }

    if (localStorage.getItem("Upload") !== null) {
      setCourse([]);
      setSections([]);
      setUploadScore(false);
      localStorage.removeItem("Upload");
      localStorage.removeItem("page");
    }

    if (!course.length && !noCourse) fetchData();

    if (params.courseNo) {
      setSelectedCourse(true);
    } else {
      setSelectedCourse(false);
      setUploadScore(false);
      setManage(false);
      localStorage.clear();
    }

    if (params.courseNo) {
      if (localStorage.getItem("page") === "upload") {
        setUploadScore(true);
      } else if (localStorage.getItem("page") === "management") {
        setManage(true);
        if (!sections.length && course.length) {
          showSection();
        }
      }
    }

    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [
    course,
    sections,
    localStorage.getItem("Upload"),
    localStorage.getItem("delete score"),
    localStorage.getItem("publish score"),
    getParams,
    params,
    searchParams,
    setSearchParams,
  ]);

  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const goToUpload = () => {
    setUploadScore(true);
    setManage(false);
    searchParams.delete("section");
    setSearchParams(searchParams);
  };

  const goToManage = () => {
    setManage(true);
    setUploadScore(false);
  };

  const CancelhandleClosePopup = () => {
    searchParams.delete("courseNo");
    setSearchParams(searchParams);
    courseForm.reset();
  };

  const ConfirmhandleClosePopup = async (data) => {
    let resp = await addCourse({
      year: parseInt(params.year),
      semester: parseInt(params.semester),
      courseNo: params.courseNo ? params.courseNo : data.courseNo,
    });
    courseForm.reset();
    setNoCourse();
    setCourse([]);
    fetchData();
  };

  return (
    <>
      {/* <SideBar /> */}
      <div className="flex flex-row gap-3 justify-center">
        <div
          className={
            showSidebar
              ? "hidden lg:flex lg:flex-col ease-in transition-transform pt-32 pb-8 lg:pt-10 lg:left-0 justify-between shadow-gray-500 shadow-xl min-h-screen h-screen "
              : "hidden lg:hidden -left-[100%] pt-32 pb-8 lg:pt-10 lg:left-0 justify-between shadow-gray-500 shadow-xl min-h-screen h-screen "
          }
          //Large Only Sidebar
        >
          <div className="flex flex-col px-5 py-14">
            <ul className="flex flex-col gap-3 pt-5 pb-10 text-gray-800 justify-center text-center items-center font-semibold mx-3 transition-all duration-1000">
              {courseData.map((data, i) => (
                <li
                  className="w-full flex flex-row cursor-pointer justify-center gap-2 text-2xl items-center hover:bg-[#D0CDFE] duration-300 px-5 py-2 rounded-xl "
                  key={i}
                  onClick={() => {
                    handleSemesterYear(data.semester, `25${data.year}`);
                  }}
                >
                  <FaChevronRight className="text-xl" />
                  <span className="flex flex-row items-center">
                    <span className="mr-2">Course </span>
                    {data.semester}/{data.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="cursor-pointer px-5">
            <div
              onClick={() => signOut().finally(navigate("/sign-in"))}
              className="text-2xl font-bold hover:bg-red-500 shadow-md duration-200 text-center rounded-2xl mt-5 py-2 justify-center border-[3px] border-red-500 text-red-500 flex items-center gap-3 hover:cursor-pointer hover:text-white"
            >
              Log out
              <FaSignOutAlt />
            </div>
          </div>
        </div>
        <div
          className={
            showSidebar ? "w-full flex lg:px-5" : "w-full flex lg:px-20"
          }
        >
          <div className="flex w-full flex-col h-full">
            {isSelectedCourse ? null : (
              <>
                <div className="py-4 lg:mt-20 md:mt-16 mt-16 px-5 lg:px-10 text-maintext font-semibold ">
                  {/* header courses : courses number, date, add course button */}
                  <div className="flex w-full justify-between">
                    <div className="flex-col flex lg:gap-1">
                      <span className="text-2xl md:text-4xl lg:text-5xl">
                        Course {params.semester}/
                        {params.year ? params.year.slice(2) : params.year}
                      </span>
                      <span className="text-md lg:text-2xl">
                        {formatDate(currentDate)}
                      </span>
                    </div>
                    <div className="flex items-end">
                      <button
                        className="text-primary px-2 py-[6px] items-center flex lg:text-xl text-sm border-primary border-2 lg:px-3 lg:py-1 rounded-xl hover:text-white hover:bg-primary duration-150 "
                        onClick={addCourseButton[1].open}
                      >
                        <FiPlus className="lg:text-3xl text-xl" />
                        <span>Add Course</span>
                      </button>
                    </div>
                  </div>
                </div>
                <Modal
                  opened={addCourseButton[0]}
                  onClose={addCourseButton[1].close}
                  centered
                  withCloseButton={false}
                  size="auto"
                  display="flex"
                  yOffset={0}
                  xOffset={0}
                  padding={0}
                  radius={20}
                >
                  <form
                    onSubmit={courseForm.onSubmit((data) => {
                      ConfirmhandleClosePopup(data);
                      addCourseButton[1].close();
                    })}
                    className="overflow-hidden "
                  >
                    <div className="overflow-hidden">
                      <div className="bg-primary flex justify-center py-2 shadow-lg">
                        <p className="text-white font-semibold text-lg md:text-xl lg:text-2xl">
                          Add Course
                        </p>
                      </div>
                      <div className="flex gap-5 p-5 items-center justify-between">
                        <p className="font-semibold text-lg md:text-xl lg:text-2xl">
                          Course :
                        </p>
                        <input
                          type="text"
                          min="0"
                          required
                          pattern="\d{6}"
                          placeholder="Type Course No"
                          {...courseForm.getInputProps("courseNo")}
                          className="rounded-lg focus:border-blue active:border-blue px-4 py-2 lg:border-2 border-[1px] border-primary my-2"
                        />
                      </div>
                      <div className="flex flex-row justify-evenly gap-3 text-black text-md md:text-lg lg:text-xl my-2 py-1">
                        <button
                          className="border-[1px] font-semibold border-gray-100 hover:bg-gray-100 active:bg-gray-200 active:border-gray-200 shadow-md rounded-xl px-5 py-2"
                          onClick={() => {
                            CancelhandleClosePopup();
                            addCourseButton[1].close();
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="text-white font-semibold border-2 border-primary bg-primary hover:border-secondary hover:bg-secondary active:border-maintext active:bg-maintext shadow-md rounded-xl px-5 py-2"
                          type="submit"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </form>
                </Modal>
                <div className="mx-3 py-3 lg:mx-[1.5%]">
                  <div className="p-5 flex-col flex gap-3 border-[3px] border-primary rounded-2xl shadow-xl lg:max-h-full md:max-h-full max-h-[400px] lg:overflow-visible overflow-x-auto">
                    {noCourse && (
                      <div className="flex w-full justify-center items-center text-maintext text-3xl lg:text-4xl transition-all duration-100 fade-bottom my-32">
                        {noCourse}
                      </div>
                    )}
                    {course.map((item, key) => {
                      return (
                        <div
                          key={key}
                          className="bg-primary py-3 rounded-xl group active:bg-maintext hover:bg-secondary items-center transition-all duration-100 fade-bottom"
                          onClick={() => onClickCourse(item)}
                        >
                          <div className="lg:px-5 px-3 py-1 font-semibold group-hover:cursor-pointer flex justify-between items-center">
                            <div className="text-white lg:text-2xl text-lg">
                              {item.courseNo}
                              {item.courseName ? ` - ${item.courseName}` : null}
                            </div>
                            <HiChevronRight className="lg:text-3xl text-xl mx-3 text-white" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            <Modal
              opened={opened}
              onClose={() => {
                close();
              }}
              centered
              withCloseButton={false}
              size="auto"
              display="flex"
              yOffset={0}
              xOffset={0}
              padding={0}
              radius={10}
              closeOnClickOutside={false}
              closeOnEscape={false}
            >
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
                  Co-Instructors have full access to edit and change scores in
                  all documents. Input an email with the domain cmu.ac.th to
                  invite.
                </p>
                <form
                  onSubmit={emailform.onSubmit((data) => {
                    instructorClosePopup(data.email);
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
                      onClick={() => {
                        close();
                        emailform.reset();
                      }}
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
            </Modal>
            {/* Pop up */}
            {isSelectedCourse && (
              <div className="mx-[2%] lg:mt-24 mt-16">
                <div className=" border-b-[1px] pb-2 border-primary mb-5">
                  <p className="flex flex-row items-center font-semibold text-primary gap-2">
                    <p
                      onClick={backToDashboard}
                      className="text-primary text-2xl cursor-pointer"
                    >
                      Course {params.semester}/{params.year.slice(2)}
                    </p>

                    <HiChevronRight className="lg:text-3xl text-lg" />
                    <p
                      onClick={backToCourse}
                      className="text-primary text-2xl cursor-pointer"
                      style={{
                        cursor: isUploadScore || isManage ? "pointer" : null,
                      }}
                    >
                      {params.courseNo}
                    </p>
                    {isUploadScore && !isManage && (
                      <>
                        <HiChevronRight className="lg:text-3xl text-lg" />
                        <p className="text-primary text-2xl cursor-pointer">
                          Upload Score
                        </p>
                      </>
                    )}
                    {isManage && (
                      <>
                        <HiChevronRight className="lg:text-3xl text-lg" />
                        <p
                          className="text-primary text-2xl cursor-pointer"
                          onClick={backToSelectSec}
                          style={{
                            cursor: searchParams.get("section")
                              ? "pointer"
                              : null,
                          }}
                        >
                          Management
                        </p>
                      </>
                    )}
                    {searchParams.get("section") && (
                      <>
                        <HiChevronRight className="lg:text-3xl text-lg" />
                        <p
                          className="text-primary text-2xl cursor-pointer"
                          onClick={showSection}
                        >
                          Section {`00${searchParams.get("section")}`}
                        </p>
                      </>
                    )}
                  </p>
                </div>

                <div className="lg:rounded-3xl rounded-xl overflow-hidden border-[3px] border-primary">
                  <div className="flex flex-col">
                    <div className="bg-primary py-3 px-5 flex flex-row w-full justify-between">
                      <div className="flex items-start flex-col justify-center">
                        <p className="text-white font-semibold text-xl lg:text-4xl">
                          {isSelectedCourse &&
                            !isManage &&
                            !isUploadScore &&
                            params.courseNo}
                          {isUploadScore &&
                            !isManage &&
                            `Upload Score ${params.courseNo}`}
                          {isManage && `Management ${params.courseNo}`}
                          {/* {isShowTableScore && <TableScore data={tableData} />} */}
                        </p>
                        <p className="text-white font-semibold text-md lg:text-xl">
                          {formatDate(currentDate)}
                        </p>
                      </div>

                      <div className="flex flex-row gap-3 py-4 text-xl text-white font-medium">
                        <div
                          className="px-3 gap-1 rounded-2xl py-1 flex justify-center items-center hover:cursor-pointer hover:text-maintext hover:bg-white hover:shadow-md"
                          onClick={handleClickInstructor}
                        >
                          <IoPersonAddOutline />
                          <p>Instructor</p>
                        </div>

                        <div
                          className="px-3 gap-1 rounded-2xl py-1 flex justify-center items-center hover:cursor-pointer hover:text-maintext hover:bg-white hover:shadow-md"
                          onClick={() => {
                            localStorage.setItem("page", "upload");
                            setUploadScore(true);
                            goToUpload();
                          }}
                        >
                          <BiPlus />
                          <p
                            style={{
                              color: isUploadScore && !isManage ? "black" : "",
                            }}
                          >
                            Upload Score
                          </p>
                        </div>

                        <div
                          className="px-3 gap-1 rounded-2xl py-1 flex justify-center items-center hover:cursor-pointer hover:text-maintext hover:bg-white hover:shadow-md"
                          onClick={() => {
                            localStorage.setItem("page", "management");
                            setManage(true);
                            goToManage();
                            showSection();
                          }}
                        >
                          <GoGear />
                          <p style={{ color: isManage ? "black" : "" }}>
                            Management
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center text-center">
                      {!isUploadScore && !isManage && (
                        <p
                          style={{
                            fontFamily: "SF Pro",
                          }}
                          className="text-3xl text-center text-maintext font-semibold my-52"
                        >
                          Please select menu in the navigation bar
                        </p>
                      )}
                    </div>
                    {/* show Upload/Section/TableScore */}
                  </div>
                </div>

                {isUploadScore && <UploadSc />}
                {isManage && <Management data={sections} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
