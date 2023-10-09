import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UploadSc, Management } from "../components";
import { StateContext, CurrentContext } from "../context";
import tabStyle from "../components/css/tableScore.module.css";
import {
  addCoInstructors,
  addCourse,
  getCourseName,
  getScores,
  signOut,
  deleteCourseReally,
  socket,
} from "../services";
import { Modal, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { HiChevronRight } from "react-icons/hi";
import { FaChevronRight, FaSignOutAlt } from "react-icons/fa";
import { AiFillMinusCircle } from "react-icons/ai";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FiPlus, FiEdit3 } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import { MdDone } from "react-icons/md";
import { TextInput, Button } from "@mantine/core";
import Course from "./css/course166.module.css";

export default function Course166Container() {
  const [noCourse, setNoCourse] = useState();
  const [course, setCourse] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [courseSelected, setCourseSelected] = useState();
  const [isSelectedCourse, setSelectedCourse] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [params, setParams] = useState({});
  const [noSections, setNoSections] = useState();
  const [sections, setSections] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const { showSidebar, handleSidebarClick, isUploadScore, setUploadScore } =
    useContext(StateContext);
  const [sidebar, setLgSidebar] = useState(false);
  const navigate = useNavigate();
  const [coInstructors, setCoInstructors] = useState("");
  const addCourseButton = useDisclosure();
  const addCoSec = useDisclosure();
  const [countChecked, setCountChecked] = useState(0);
  const { current } = useContext(CurrentContext);
  const [checkedSections, setCheckedSections] = useState([]);

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
  const instructorClosePopup = async () => {
    if (!isEmailValid) {
      return;
    }
    if (!sections.length) {
      const data = {
        courseNo: searchParams.get("courseNo"),
        year: searchParams.get("year"),
        semester: searchParams.get("semester"),
        coInstructors: coInstructors,
      };
      await addCoInstructors(data);
      emailform.reset();
    } else {
      addCoSec[1].open();
    }
    close();
  };

  const handleCheckboxChange = (e, value) => {
   
    if (e.target.checked === true) {
      setCountChecked(countChecked + 1);
    } else {
      setCountChecked(countChecked - 1);
    }
    const coEachSec = value.section;
    if (e.target.checked) {
      setCheckedSections([...checkedSections, coEachSec]);
    } else {
      setCheckedSections(checkedSections.filter((c) => c !== coEachSec));
    }
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
    const data = item.sections.filter((e) => e.section);
    setCourseSelected(item.courseName);
    setSections(data);
    setUploadScore(false);
    setSelectedCourse(true);
    searchParams.set("courseNo", courseNo);
    setSearchParams(searchParams);
  };

  const backToDashboard = () => {
    localStorage.removeItem("page");
    localStorage.removeItem("Edit");
    localStorage.removeItem("editScore");
    setUploadScore(false);
    setSelectedCourse(false);
    searchParams.delete("courseNo");
    searchParams.delete("section");
    setSearchParams(searchParams);
  };

  const backToCourse = () => {
    localStorage.removeItem("page");
    localStorage.removeItem("Edit");
    localStorage.removeItem("editScore");
    setUploadScore(false);
    searchParams.delete("section");
    setSearchParams(searchParams);
  };

  const backToSec = () => {
    localStorage.removeItem("Edit");
    localStorage.removeItem("editScore");
  };

  const clickDeleteCourse = async (course) => {
    await deleteCourseReally({
      courseNo: course,
      year: searchParams.get("year"),
      semester: searchParams.get("semester"),
    });
  };

  const fetchData = async () => {
    const resp = await getScores(params.year, params.semester);
    if (resp.ok) {
      setCourse(resp.course);
      setNoCourse();
    } else {
      setNoCourse(resp.message);
      setCourse([]);
    }
  };

  const showSection = () => {
    const data = course.filter((e) => e.courseNo === params.courseNo)[0];
    setCourseSelected(data.courseName);
    const sections = data.sections.filter((e) => e.section);
    if (!sections.length) {
      setNoSections("No section");
      setSections([]);
    } else {
      setSections(sections);
      setNoSections();
    }
    setUploadScore(false);
  };

  useEffect(() => {
    socket.on("courseUpdate", (course) => {
      setCourse([]);
      setNoCourse();
      setSections([]);
      setNoSections();
      fetchData();
    });
  }, []);

  useEffect(() => {
    setCourse([]);
    setNoCourse();
    setSections([]);
    setNoSections();
  }, [params.year, params.semester]);

  useEffect(() => {
    if (!searchParams.get("year") || !searchParams.get("semester")) {
      return navigate("/instructor-dashboard");
    }

    if (!course.length && !noCourse) fetchData();

    if (searchParams.get("courseNo")) {
      setSelectedCourse(true);
    } else {
      setSelectedCourse(false);
      setUploadScore(false);
      localStorage.clear();
    }

    if (searchParams.get("courseNo")) {
      if (localStorage.getItem("page") === "upload") {
        setUploadScore(true);
      }
      if (!sections.length && !noSections && course.length) {
        showSection();
      }
    }

    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [course, sections, getParams, params, searchParams, setSearchParams]);

  const formatDate = (date) => {
    const buddhistYear = date.getFullYear() + 543;
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = date
      .toLocaleDateString("en-US", options)
      .replace(/\d{4}/, `${buddhistYear}`);

    return formattedDate;
  };

  const goToUpload = () => {
    localStorage.setItem("page", "upload");
    setUploadScore(true);
    searchParams.delete("section");
    setSearchParams(searchParams);
  };

  const CancelhandleClosePopup = () => {
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
    await addCourse({
      year: parseInt(params.year),
      semester: parseInt(params.semester),
      courseNo: data.courseNo,
      courseName: data.courseName,
    });
    courseForm.reset();
  };

  const addCoAllSec = async () => {
    const data = {
      courseNo: searchParams.get("courseNo"),
      year: searchParams.get("year"),
      semester: searchParams.get("semester"),
      coInstructors: coInstructors,
      type: "addCoAllSec",
    };
    await addCoInstructors(data);
    addCoSec[1].close();
    setCheckedSections([]);
    emailform.reset();
  };

  const addCoEachSec = async () => {
    const section_arr = [];
    for (let checked in checkedSections) {
      sections.map((e) => {
        if (e.section == checkedSections[checked]) section_arr.push(e.section);
      });
    }
    const data = {
      courseNo: searchParams.get("courseNo"),
      year: searchParams.get("year"),
      semester: searchParams.get("semester"),
      sections: section_arr,
      coInstructors: coInstructors,
      type: "addCoEachSec",
    };
    await addCoInstructors(data);
    addCoSec[1].close();
    setCheckedSections([]);
    emailform.reset();
  };

  const isCurrent =
    searchParams.get("year") == current[0]?.year &&
    searchParams.get("semester") == current[0]?.semester;

  return (
    <>
      {/* <SideBar /> */}
      <div className="flex flex-row gap-3 justify-center ">
        <div
          className={`hidden lg:flex lg:overflow-hidden lg:flex-col pt-32 pb-8 lg:pt-10 lg:left-0 justify-between shadow-gray-500 shadow-xl min-h-screen h-screen duration-500 ${
            showSidebar
              ? "transform translate-x-0 w-[300px]"
              : "transform -translate-x-full w-0"
          }`}
        >
          <div className="flex flex-col px-3 mt-14 overflow-y-auto">
            <ul className="flex flex-col gap-3 pt-2  text-gray-800 justify-center text-center items-center font-semibold ">
              {current?.map((data, i) => (
                <li
                  className="w-full flex flex-row cursor-pointer justify-center gap-2 text-lg items-center hover:bg-[#D0CDFE] duration-300 px-5 py-2 rounded-xl mr-3"
                  key={i}
                  onClick={() => {
                    handleSemesterYear(data.semester, data.year);
                  }}
                >
                  <FaChevronRight className="text-lg" />
                  <div className="flex flex-row items-center">
                    <div className="mr-2">Course </div>
                    {data.semester}/{data.year.toString().slice(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="cursor-pointer px-5">
            <div
              onClick={() => signOut().finally(navigate("/"))}
              className="text-lg font-bold hover:bg-red-500 shadow-md duration-200 text-center rounded-3xl mt-5 py-1 justify-center border-[3px] border-red-500 text-red-500 flex items-center gap-3 hover:cursor-pointer hover:text-white"
            >
              Log out
              <FaSignOutAlt />
            </div>
          </div>
        </div>
        <div
          className={`w-full flex overflow-x-auto ${
            showSidebar && "lg:px-5 "
          }`}
        >
          <div className="flex w-full flex-col h-full">
            {isSelectedCourse ? null : (
              <>
                <div
                  className=" text-maintext font-semibold cursor-default py-2 
                                 xl:mt-20 lg:mt-19 md:mt-16 sm:mt-16 mt-16 
                                 xl:px-10lg: lg:px-9 md: md:px-8 sm:px-8  px-6
                                 "
                ></div>
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
                      <div className="flex text-black justify-center text-md md:text-lg lg:text-xl my-2 py-1">
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

                <div className="mx-[1%] lg:mt-3 max-h-fit bg-slate-50">
                  <div className=" lg:rounded-xl rounded-xl xl:h-[calc(90vh-50px)] lg:h-[calc(89vh-30px)] md:h-[calc(93vh-50px)]   h-[calc(93vh-50px)] overflow-hidden border-[3px] border-primary sm:mb-12">
                    <div className=" bg-primary lg:py-2 py-2 lg:px-5 px-3 flex flex-row items-center justify-between cursor-default">
                      <div className="flex items-start flex-col justify-center ">
                        <p className="text-white font-semibold xl:text-4xl lg:text-4xl md:text-3xl text-3xl">
                          Course {params.semester}/
                          {params.year ? params.year.slice(2) : params.year}
                        </p>
                        <p className="text-white lg:font-semibold xl:text-xl lg:text-xl md:text-lg text-base md:font-normal sm:font-normal">
                          {formatDate(currentDate)}
                        </p>
                      </div>
                      {isCurrent && (
                        <div
                          className=" flex lg:flex-row  md:flex-row flex-col gap-2 lg:py-4 md:py-4 py-1 items-end 
                                          lg:text-xl md:text-lg text-md text-white font-medium w-22 "
                        >
                          <div
                            className={`lg:px-3 px-2 rounded-2xl py-1 flex md:gap-2 gap-2 justify-center items-center hover:cursor-pointer
                            hover:shadow-md lg:w-[115px] md:w-[92px] w-[83px] transition ease-in-out cursor-pointer ${
                              isDelete
                                ? " border-green-500 hover: hover:bg-green-400"
                                : " border-orange-400 hover: hover:bg-orange-400"
                            }`}
                            onClick={() => setIsDelete(!isDelete)}
                          >
                            {!isDelete && (
                              <>
                                {" "}
                                <FiEdit3 className="lg:pr-2 lg:text-3xl text-xl" />
                                <span>Edit</span>{" "}
                              </>
                            )}
                            {isDelete && (
                              <>
                                <MdDone className="lg:text-3xl text-xl" />
                                <span>Done</span>
                              </>
                            )}
                          </div>
                          <div
                            className="lg:px-5 px-2 gap-1 rounded-2xl py-1 flex justify-center items-center hover:cursor-pointer hover:text-black hover:bg-white hover:shadow-md transition ease-in-out"
                            onClick={addCourseButton[1].open}
                          >
                            <FiPlus className="lg:text-3xl text-xl " />
                            <span>Add Course</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className=" max-h-screen">
                      <div
                        className={
                          " overflow-y-auto xl:h-[calc(90vh-140px)] lg:h-[calc(89vh-120px)] md:h-[calc(93vh-138px)]  h-[calc(93vh-131px)]"
                        }
                      >
                        {noCourse && (
                          <div className="flex flex-col justify-center text-center items-center overflow-hidden  xl:h-[calc(84vh-205px)] lg:h-[calc(83vh-197px)] md:h-[calc(85vh-207px)] h-[calc(85vh-193px)] ">
                            <p className="xl:text-3xl lg:text-2xl md:text-xl text-lg text-maintext font-semibold ">
                              {noCourse}
                            </p>
                            <span className="xl:text-2xl lg:text-xl md:text-lg text-base text-maintext opacity-60 ">
                              Click add course at top right corner
                            </span>
                          </div>
                        )}
                        {!course.length && !noCourse && (
                          <div className="flex flex-col justify-center text-center items-center xl:h-[calc(84vh-205px)] lg:h-[calc(83vh-197px)] md:h-[calc(85vh-207px)] h-[calc(85vh-193px)] ">
                            <p className="xl:text-3xl lg:text-2xl md:text-xl text-lg text-maintext font-semibold ">
                              Loading....
                            </p>
                          </div>
                        )}
                        <div className="overflow-y-auto h-fit">
                          {course.map((item, key) => {
                            return (
                              <div
                                key={key}
                                className="flex-row flex lg:px-4 lg:text-2xl px-5 gap-3 py-3 items-center"
                              >
                                {isDelete && (
                                  <AiFillMinusCircle
                                    className=" text-4xl text-red-500 cursor-pointer"
                                    onClick={() =>
                                      clickDeleteCourse(item.courseNo)
                                    }
                                  />
                                )}
                                <div
                                  className="  w-full  lg:py-3 py-2 rounded-xl group bg-white active:bg-gray-300 hover:bg-gray-200 items-center transition-all duration-100 drop-shadow-lg fade-bottom lg:text-2xl px-5 "
                                  onClick={() => onClickCourse(item)}
                                >
                                  <div
                                    className={`lg:px-5 px-3 lg:py-3 py-2 font-medium flex justify-between items-center ${
                                      isDelete
                                        ? "cursor-default"
                                        : "cursor-pointer"
                                    }`}
                                  >
                                    <div className="text-black lg:text-2xl text-lg">
                                      {item.courseNo}
                                      {item.courseName
                                        ? ` - ${item.courseName}`
                                        : null}
                                    </div>

                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <Modal
              opened={addCoSec[0]}
              onClose={addCoSec[1].close}
              centered
              withCloseButton={false}
              size="auto"
              display="flex"
              yOffset={0}
              xOffset={0}
              padding={0}
              radius={10}
              overlayProps={{
                opacity: 0.55,
                blur: 3,
              }}
              closeOnClickOutside={false}
              closeOnEscape={false}
            >
              <div className=" align-middle justify-center text-center">
                <div className="bg-primary py-1.5 px-8 flex justify-center  font-semibold mb-3">
                  <p className="text-white lg:text-2xl  font-semibold text-center gap-2 text-lg">
                    Select section to Add Co-Instructor
                  </p>
                </div>
                <div className="h-fit max-h-96 overflow-y-auto">
                  {sections?.map((value, key) => (
                    <div
                      key={key}
                      className="flex justify-center gap-5 mb-4 sm:text-md"
                    >
                      <Checkbox
                        color="indigo"
                        size="md"
                        onChange={(e) => handleCheckboxChange(e, value)}
                        id="selected-section"
                        name="selected-section"
                        style={{
                          justifyContent: "center",
                          display: "flex",
                          alignItems: "center",
                        }}
                      />
                      <p style={{ fontSize: "22px" }}>
                        Section{" "}
                        {value.section < 10
                          ? `00${value.section}`
                          : value.section < 100
                          ? `0${value.section}`
                          : value.section}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden">
                  <div>
                    <div className={tabStyle.ScorePopupButtons}>
                      <Button
                        onClick={() => {
                          addCoAllSec();
                        }}
                        className={tabStyle.secondaryButton}
                        sx={{
                          color: "black",
                          "&:hover": {
                            backgroundColor: "#8084c8",
                            color: "#ffffff",
                          },
                        }}
                      >
                        All Sections
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
                        onClick={() => {
                          addCoEachSec();
                        }}
                        radius="md"
                        disabled={countChecked === 0}
                      >
                        Confirm
                      </Button>
                    </div>
                    <div className={tabStyle.ScorePopupButtons2}>
                      <Button
                        className={tabStyle.tertiaryButton}
                        onClick={() => {
                          addCoSec[1].close();
                          setCheckedSections([]);
                          emailform.reset();
                        }}
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
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
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
                <div className="bg-primary flex justify-center py-1.5 shadow-xl">
                  <p className="text-white font-semibold text-2xl">
                    {`Add Co-Instructor ${params.courseNo}`}
                  </p>
                </div>
                <div className="text-gray-600 text-[18px] text-center px-10 py-5 max-w-lg">
                  {sections.length ? (
                    " Input an email with the domain cmu.ac.th to invite."
                  ) : (
                    <>
                      Note: If you add Co-Instructor before uploading your
                      scores, Co-Instructor can access and edit scores in all
                      sections. <br />
                      Input an email with the domain cmu.ac.th to invite.
                    </>
                  )}
                </div>

                <form
                  onSubmit={emailform.onSubmit((data) => {
                    setCoInstructors(data.email);
                    instructorClosePopup();
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
                        {sections.length ? "Continue" : "Add"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </Modal>
            {/* Pop up */}
            {isSelectedCourse && (
              <div className="mx-[2%] lg:mt-24 mt-20 max-h-screen">
                <div className="  pb-2 xl:mb-5 lg:mb-4 md:mb-3 mb-2  ">
                  <p className="flex flex-row items-center font-semibold text-primary gap-2 xl:-mt-2.5 lg:-mt-5 md:-mt-2.5 -mt-2 ">
                    <p
                      onClick={backToDashboard}
                      className="text-primary lg:text-xl text-md cursor-pointer flex flex-row gap-1"
                    >
                      <span className="sm:block hidden">Course </span>
                      <span>
                        {params.semester}/{params.year.slice(2)}
                      </span>
                    </p>

                    <HiChevronRight className="lg:text-2xl text-md" />
                    <p
                      onClick={() => {
                        backToCourse();
                        showSection();
                      }}
                      className="text-primary lg:text-xl text-md"
                      style={{
                        cursor:
                          isUploadScore || searchParams.get("section")
                            ? "pointer"
                            : "default",
                      }}
                    >
                      {params.courseNo}
                    </p>
                    {isUploadScore && (
                      <>
                        <HiChevronRight className="lg:text-2xl text-md" />
                        <p className="text-primary lg:text-xl text-md cursor-default">
                          Upload Score
                        </p>
                      </>
                    )}
                    {searchParams.get("section") && (
                      <>
                        <HiChevronRight className="lg:text-2xl text-md" />
                        <p
                          className="text-primary lg:text-xl text-md flex flex-row gap-1"
                          style={{
                            cursor:
                              searchParams.get("section") &&
                              localStorage.getItem("editScore")
                                ? "pointer"
                                : "default",
                          }}
                          onClick={() => {
                            backToSec();
                          }}
                        >
                          <span className="sm:block hidden">Section</span>
                          <span className="sm:hidden block">Sec</span>
                          {searchParams.get("section") < 10
                            ? `00${searchParams.get("section")}`
                            : searchParams.get("section") < 100
                            ? `0${searchParams.get("section")}`
                            : searchParams.get("section")}
                        </p>
                      </>
                    )}
                    {searchParams.get("section") &&
                      localStorage.getItem("editScore") && (
                        <>
                          <HiChevronRight className="lg:text-2xl text-md" />
                          <p
                            className="text-primary lg:text-xl text-md"
                            style={{
                              cursor: "default",
                            }}
                          >
                            {localStorage.getItem("editScore")}
                          </p>
                        </>
                      )}
                  </p>
                  <div className="mt-3 border-b-[3px] border-primary shadow-inset-md opacity-25"></div>
                </div>

                <div className="lg:rounded-xl rounded-xl xl:h-[calc(84vh-60px)] lg:h-[calc(83vh-60px)] md:h-[calc(85vh-55px)]  h-[calc(85vh-50px)] overflow-hidden border-[3px] border-primary">
                  <div className="flex flex-col">
                    <div className="bg-primary lg:py-2 py-2 lg:px-5 px-3 flex flex-row w-full items-center justify-between cursor-default">
                      <div className="flex items-start flex-col justify-center ">
                        <p className="text-white lg:font-semibold xl:text-4xl lg:text-4xl md:text-3xl text-3xl md:font-medium sm:font-medium">
                          {isSelectedCourse &&
                            !isUploadScore &&
                            params.courseNo}

                          {isUploadScore && (
                            <>
                              <p
                                className="xl:hidden lg:hidden md:hidden sm:hidden block 
                                             text-[29px]"
                              >
                                Upload Score
                              </p>
                              <p
                                className="xl:text-4xl lg:text-4xl md:text-3xl  sm:text-3xl
                                           xl:block lg:block md:block sm:block hidden"
                              >
                                {`Upload Score ${params.courseNo}`}
                              </p>
                            </>
                          )}
                        </p>

                        <p className="text-white lg:font-semibold xl:text-xl lg:text-xl md:text-lg text-base md:font-normal sm:font-normal">
                          {formatDate(currentDate)}
                        </p>
                      </div>

                      {isCurrent && (
                        <div
                          className="flex md:flex-row flex-col gap-2 items-end lg:py-4 md:py-4 
                        py-1 lg:text-xl md:text-lg text-md text-white font-medium w-22 "
                        >
                          <div
                            className="lg:px-5 px-3 gap-1 rounded-2xl py-1 flex justify-end md:justify-center items-center hover:cursor-pointer hover:text-black hover:bg-white hover:shadow-md
                                    "
                            onClick={() => open()}
                          >
                            <AiOutlineUserAdd className="lg:text-3xl text-xl " />
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
                              "lg:px-5 px-2 gap-1 rounded-2xl py-1 flex justify-center items-center hover:cursor-pointer hover:text-black hover:bg-white transition ease-in-out duration-250 hover:shadow-md"
                            }
                            onClick={goToUpload}
                          >
                            <BiPlus className="lg:text-3xl text-xl "/>
                            <p>Upload Score</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {isUploadScore && <UploadSc />}
                  {!isUploadScore && (
                    <Management data={sections} courseName={courseSelected} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
