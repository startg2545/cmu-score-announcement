import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UploadSc, Management } from "../components";
import { ShowSidebarContext } from "../context";
import {
  addCoInstructors,
  addCourse,
  getCourseName,
  getScores,
} from "../services";
import { Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { HiChevronRight } from "react-icons/hi";
import { FaChevronRight } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import { GoGear } from "react-icons/go";
import courseData from "./courseData";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "../services";
import { TextInput, Button, Flex } from "@mantine/core";
import Course from "./css/course166.module.css";
import { IconAt } from "@tabler/icons-react";

export default function Course166Container() {
  const [noCourse, setNoCourse] = useState();
  const [course, setCourse] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSelectedCourse, setSelectedCourse] = useState(false);
  const [isUploadScore, setUploadScore] = useState(false);
  const [params, setParams] = useState({});
  const [sections, setSections] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const { showSidebar, handleSidebarClick } = useContext(ShowSidebarContext);
  const [sidebar, setLgSidebar] = useState(false);
  const navigate = useNavigate();
  const addCourseButton = useDisclosure();
  const [courseNo, setCourseNo] = useState("");
  const [courseNoError, setCourseNoError] = useState("");

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
      courseName: "",
    },
    validate: {
      courseNo: (value) => {
        if (!value) {
          return "Course No. is required";
        }
        const isValid = /^\d{6}$/.test(value);
        return isValid ? null : "Please enter a valid course no";
      },
      courseName: (value) => {
        if (!value) {
          return "Course Name is required";
        }
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
    const data = item
      .sections.filter((e) => e.section);
    setSections(data);
    setUploadScore(false);
    setSelectedCourse(true);
    searchParams.set("courseNo", courseNo);
    setSearchParams(searchParams);
  };

  const backToDashboard = () => {
    localStorage.removeItem("page");
    setUploadScore(false);
    setSelectedCourse(false);
    searchParams.delete("courseNo");
    searchParams.delete("section");
    setSearchParams(searchParams);
  };

  const backToCourse = () => {
    localStorage.removeItem("page");
    setUploadScore(false);
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
    const resp = await getScores(params.year, params.semester);
    if (resp.ok) {
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
      localStorage.clear();
    }

    if (params.courseNo) {
      if (localStorage.getItem("page") === "upload") {
        setUploadScore(true);
      } else if (localStorage.getItem("page") === "management") {
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
    searchParams.delete("section");
    setSearchParams(searchParams);
  };

  const goToManage = () => {
    setUploadScore(false);
  };

  const CancelhandleClosePopup = () => {
    searchParams.delete("courseNo");
    setSearchParams(searchParams);
    courseForm.reset();
  };

  const handleCourseNoChange = async (value) => {
    courseForm.setValues({ ...courseForm.values, courseName: "" });
    if (value) {
      const courseName = await getCourseName(value);
      if (courseName.ok) {
        if (courseName.courseDetails.length) {
          console.log(courseName.courseDetails[0].courseNameEN);
          courseForm.setValues({
            ...courseForm.values,
            courseName: courseName.courseDetails[0].courseNameEN,
          });
        }
      }
    }
  };

  const ConfirmhandleClosePopup = async (data) => {
    let resp = await addCourse({
      year: parseInt(params.year),
      semester: parseInt(params.semester),
      courseNo: data.courseNo,
      courseName: data.courseName,
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
          className={`hidden lg:flex lg:overflow-hidden lg:flex-col pt-32 pb-8 lg:pt-10 lg:left-0 justify-between shadow-gray-500 shadow-xl min-h-screen h-screen duration-500  ${
            showSidebar
              ? "transform translate-x-0 w-[300px]"
              : "transform -translate-x-full w-0"
          }`}
        >
          <div className="flex flex-col px-3 py-14">
            <ul className="flex flex-col gap-3 pt-2 pb-10 text-gray-800 justify-center text-center items-center font-semibold ">
              {courseData.map((data, i) => (
                <li
                  className="w-full flex flex-row cursor-pointer justify-center gap-2 text-lg items-center hover:bg-[#D0CDFE] duration-300 px-5 py-2 rounded-xl mr-3"
                  key={i}
                  onClick={() => {
                    handleSemesterYear(data.semester, `25${data.year}`);
                  }}
                >
                  <FaChevronRight className="text-lg" />
                  <div className="flex flex-row items-center">
                    <div className="mr-2">Course </div>
                    {data.semester}/{data.year}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="cursor-pointer px-5">
            <div
              onClick={() => signOut().finally(navigate("/sign-in"))}
              className="text-lg font-bold hover:bg-red-500 shadow-md duration-200 text-center rounded-3xl mt-5 py-1 justify-center border-[3px] border-red-500 text-red-500 flex items-center gap-3 hover:cursor-pointer hover:text-white"
            >
              Log out
              <FaSignOutAlt />
            </div>
          </div>
        </div>
        <div className={showSidebar ? "w-full flex lg:px-5" : "w-full flex "}>
          <div className="flex w-full flex-col h-full">
            {isSelectedCourse ? null : (
              <>
                <div className=" py-4 lg:mt-20 md:mt-16 mt-16 px-5 lg:px-10 text-maintext font-semibold ">
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
                  closeOnClickOutside={false}
                >
                  <form
                    onSubmit={courseForm.onSubmit((data) => {
                      ConfirmhandleClosePopup(data);
                      addCourseButton[1].close();
                    })}
                  >
                    <div className="overflow-hidden">
                      <div className="bg-primary flex justify-center py-2 shadow-lg">
                        <p className="text-white font-semibold text-lg md:text-xl lg:text-2xl ">
                          Add Course
                        </p>
                      </div>
                      <div className="flex gap-5 p-5 items-center justify-between">
                        <p className="font-semibold text-sm md:text-xl lg:text-2xl">
                          Course No:
                        </p>
                        <TextInput
                          placeholder="Type Course No"
                          {...courseForm.getInputProps("courseNo")}
                          size="md"
                          radius="md"
                          onBlur={(e) => handleCourseNoChange(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-5 p-5 pt-0 items-center justify-between">
                        <p className="font-semibold text-sm md:text-md lg:text-2xl">
                          Course Name:
                        </p>
                        <TextInput
                          placeholder="Type Course Name"
                          {...courseForm.getInputProps("courseName")}
                          size="md"
                          radius="md"
                          value={courseForm.values.courseName}
                        />
                      </div>
                      <div className="flex flex-row justify-evenly gap-3 text-black text-md md:text-lg lg:text-xl my-2 py-1">
                        <Button
                          className={Course.AddCourseCancelButton}
                          onClick={() => {
                            CancelhandleClosePopup();
                            addCourseButton[1].close();
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
                          className={Course.AddCourseConfirmButton}
                          type="submit"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </form>
                </Modal>
                <div className="mx-3 py-3 lg:mx-[1.5%]">
                  <div className="p-5 flex-col flex gap-5  border-[3px] border-primary rounded-2xl shadow-xl lg:max-h-full md:max-h-full max-h-[400px] lg:overflow-visible overflow-x-auto">
                    {noCourse && (
                      <div className="flex w-full justify-center items-center text-maintext text-3xl lg:text-4xl transition-all duration-100 fade-bottom my-32 ">
                        {noCourse}
                      </div>
                    )}
                    {course.map((item, key) => {
                      return (
                        <div
                          key={key}
                          className="bg-primary py-3 rounded-xl group active:bg-maintext hover:bg-secondary items-center transition-all duration-100 fade-bottom "
                          onClick={() => onClickCourse(item)}
                        >
                          <div className="lg:px-5 px-3 py-2 font-medium group-hover:cursor-pointer flex justify-between items-center">
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
              <div className="flex flex-col">
                <div className="bg-primary flex justify-center py-3 shadow-xl">
                  <p className="text-white font-semibold text-2xl">
                    {`Add Co-Instructor ${params.courseNo}`}
                  </p>
                </div>
                <div className="text-gray-600 text-[18px] px-10 text-center py-5 max-w-lg">
                  Co-Instructors have full access to edit and change scores in
                  all documents. Input an email with the domain cmu.ac.th to
                  invite.
                </div>
                <form
                  onSubmit={emailform.onSubmit((data) => {
                    instructorClosePopup(data.email);
                  })}
                  className="px-10 lg:px-24"
                >
                  <TextInput
                    placeholder="Type email to add co-instructor"
                    required
                    {...emailform.getInputProps("email")}
                  />
                  <div className="overflow-hidden">
                    <div className="flex flex-row justify-evenly gap-3 text-black text-md md:text-lg lg:text-xl my-4 py-1">
                      <Button
                        //className="border-[1px] font-semibold border-gray-100 hover:bg-gray-100 active:bg-gray-200 active:border-gray-200 shadow-md rounded-xl px-5 py-2"
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
                        //className="text-white font-semibold border-2 border-primary bg-primary hover:border-secondary hover:bg-secondary active:border-maintext active:bg-maintext shadow-md rounded-xl px-5 py-2"
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
                    </div>
                  </div>
                </form>
              </div>
            </Modal>
            {/* Pop up */}
            {isSelectedCourse && (
              <div className="mx-[2%] lg:mt-24 mt-20 max-h-screen">
                <div className="  pb-2 mb-5   ">
                  <p className="flex flex-row items-center font-semibold text-primary gap-3 xl:-mt-2.5 lg:-mt-5 md:-mt-2.5  -mt-1 ">
                    <p
                      onClick={backToDashboard}
                      className="text-primary lg:text-xl text-md cursor-pointer"
                    >
                      Course {params.semester}/{params.year.slice(2)}
                    </p>

                    <HiChevronRight className="lg:text-2xl text-md" />
                    <p
                      onClick={() => {
                        localStorage.setItem("page", "management");
                        backToCourse();
                        showSection();
                      }}
                      className="text-primary lg:text-xl text-md cursor-pointer"
                      style={{
                        cursor: isUploadScore ? "pointer" : null,
                      }}
                    >
                      {params.courseNo}
                    </p>
                    {isUploadScore && (
                      <>
                        <HiChevronRight className="lg:text-2xl text-md" />
                        <p className="text-primary lg:text-xl text-md cursor-pointer">
                          Upload Score
                        </p>
                      </>
                    )}
                    {/* {isManage && (
                      <>
                        <HiChevronRight className="lg:text-2xl text-md" />
                        <p
                          className="text-primary lg:text-xl text-md cursor-pointer"
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
                    )} */}
                    {searchParams.get("section") && (
                      <>
                        <HiChevronRight className="lg:text-2xl text-md" />
                        <p
                          className="text-primary lg:text-xl text-md cursor-pointer"
                          onClick={showSection}
                        >
                          Section {`00${searchParams.get("section")}`}
                        </p>
                      </>
                    )}
                  </p>
                  <div className="mt-3 border-b-[3px] border-primary shadow-inset-md opacity-25"></div>
                </div>

                <div className="lg:rounded-2xl rounded-xl xl:h-[calc(84vh-60px)] lg:h-[calc(83vh-60px)] md:h-[calc(85vh-55px)]  h-[calc(85vh-50px)] overflow-hidden border-[3px] border-primary">
                  <div className="flex flex-col">
                    <div className="bg-primary lg:py-2 py-2 lg:px-5 px-3 flex flex-row w-full justify-between">
                      <div className="flex items-start flex-col justify-start">
                        <p className="text-white font-semibold text-3xl lg:text-4xl">
                          {isSelectedCourse &&
                            !isUploadScore &&
                            params.courseNo}
                          {isUploadScore && `Upload Score ${params.courseNo}`}
                          {/* {`Management ${params.courseNo}`} */}
                          {/* {isShowTableScore && <TableScore data={tableData} />} */}
                        </p>
                        <p className="text-white font-semibold text-lg lg:text-md">
                          {formatDate(currentDate)}
                        </p>
                      </div>

                      <div className="flex lg:flex-row flex-col gap-1 lg:py-4 py-1 lg:text-xl md:text-lg text-md text-white font-medium">
                        <div
                          className="lg:px-5 px-3 gap-1 rounded-2xl py-1 flex justify-center items-center hover:cursor-pointer hover:text-black hover:bg-white hover:shadow-md"
                          onClick={() => open()}
                        >
                          <IoPersonAddOutline />
                          <p>Instructor</p>
                        </div>

                        <div
                          style={{
                            background: isUploadScore ? "white" : "",
                            color: isUploadScore ? "black" : "",
                            boxShadow: isUploadScore
                              ? "0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset"
                              : "none",
                          }}
                          className={
                            "lg:px-5 px-2 gap-1 rounded-2xl py-1 flex justify-center items-center hover:cursor-pointer hover:text-black hover:bg-white hover:shadow-md"
                          }
                          onClick={() => {
                            localStorage.setItem("page", "upload");
                            setUploadScore(true);
                            goToUpload();
                          }}
                        >
                          <BiPlus />
                          <p>Upload Score</p>
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex items-center justify-center  text-center bg-red-100">
                      {!isUploadScore && sections.length === 0 && (
                        <p className="text-3xl text-center text-maintext font-semibold ">
                          Please select menu in the navigation bar
  
                        </p>
                      )}
                    </div> */}
                    {/* show Upload/Section/TableScore */}
                  </div>
                  {isUploadScore && <UploadSc />}
                  {!isUploadScore && <Management data={sections} />}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
