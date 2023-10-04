import React, { useState, useEffect, useContext } from "react";
import { TextInput, Button, Radio, Group, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import {
  addCurrent,
  getCurrent,
  deleteCurrent,
  signOut,
  getAdminUser,
  deleteAdmin,
  addAdmin,
  socket,
} from "../services";
import { CurrentContext, UserInfoContext, StateContext } from "../context";
import { useForm } from "@mantine/form";
import { AiOutlineUserAdd } from "react-icons/ai";
import Course from "./css/course166.module.css";
import { FaChevronRight, FaSignOutAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const { userInfo } = useContext(UserInfoContext);
  const { current, setCurrent } = useContext(CurrentContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [admins, setAdmins] = useState([]);
  const { showSidebar, handleSidebarClick } = useContext(StateContext);
  const [sidebar, setLgSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("adminUpdate", (admin) => {
      setAdmins([]);
      fetchAdmin();
    });
  }, []);

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

  const submitForm = useForm({
    initialValues: {
      semester: "",
      year: "",
    },
    validate: {
      semester: (value) => {
        if (!value) {
          return "semester is required";
        }
      },
      year: (value) => {
        if (!value) {
          return "year is required";
        }

        const currentYear = new Date().getFullYear() + 543;
        const enteredYear = parseInt(value);
        if (isNaN(enteredYear)) {
          return "Invalid year for B.E. program";
        }
        // else if (enteredYear > currentYear || enteredYear < currentYear - 1) {
        //   return "Year must be the current year or less than 1 year.";
        // }
      },
    },
    validateInputOnBlur: true,
  });

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

  const adminClosePopup = async (data) => {
    if (!isEmailValid) {
      return;
    }
    const resp = await addAdmin({ admin: data });
    emailform.reset();
    close();
  };

  const handleSubmit = async (data) => {
    const resp_add = await addCurrent({
      semester: data.semester,
      year: data.year,
    });
    fetchData();
    submitForm.reset();
  };

  const fetchData = async () => {
    const resp = await getCurrent();
    setCurrent(resp);
  };

  const fetchAdmin = async () => {
    const resp = await getAdminUser();
    if (resp.ok) {
      setAdmins(resp.admin);
      console.log(resp.admin);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const resp = await getCurrent();
      setCurrent(resp);
    };
    if (userInfo.itAccountType) {
      fetchData();
      if (!admins.length) {
        fetchAdmin();
      }
    }
  }, [setCurrent]);

  const handleDelete = async (_id) => {
    const resp = await deleteCurrent({
      _id: _id,
    });
    fetchData();
  };

  const deleteAdmins = async (_id) => {
    const resp = await deleteAdmin({
      _id: _id,
    });
    fetchAdmin();
  };

  const formatDate = (date) => {
    const buddhistYear = date.getFullYear() + 543;
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = date
      .toLocaleDateString("en-US", options)
      .replace(/\d{4}/, `${buddhistYear}`);

    return formattedDate;
  };

  const showCurrent = current?.map((element, key) => {
    return (
      <div
        className="bg-white drop-shadow border-black-50 border-[1px] xl:text-lg text-base  xl:mt-3 md:mt-0 mt-3
                      xl:w-[300px] lg:w-[240px] md:w-[250px] w-[230px] h-[50px] rounded-xl flex 
                      justify-between items-center px-10 cursor-default"
        key={key}
      >
        {element.semester}/{element.year}
        <button
          style={{ color: "red" }}
          onClick={() => handleDelete(element._id)}
          className="xl:px-4 "
        >
          <b>Delete</b>
        </button>
      </div>
    );
  });

  const showEmail = admins?.map((element, key) => {
    return (
      <div
        className="bg-white drop-shadow border-black-50 border-[1px] xl:text-lg text-xs md:text-lg  xl:mt-3 md:mt-0 mt-3
                      xl:w-[550px] lg:w-[640px] md:w-[380px] w-[230px] h-[50px] rounded-xl flex 
                      justify-between items-center px-3 cursor-default"
        key={key}
      >
        {element.admin.replace("@cmu.ac.th", "")}

        {element.admin !== userInfo.cmuAccount ? (
          <button
            style={{ color: "red" }}
            onClick={() => deleteAdmins(element._id)}
            className="xl:px-4 "
          >
            <b>Delete</b>
          </button>
        ) : (
          <p style={{ color: "green" }} className="xl:px-6 font-bold">
            (You)
          </p>
        )}
      </div>
    );
  });

  return (
    <>
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
            <p className="text-white font-semibold text-2xl">{`Add Admin`}</p>
          </div>
          <div className="text-gray-600 text-[18px] text-center px-10 py-5 max-w-lg">
            <>Input an email with the domain cmu.ac.th to invite.</>
          </div>
          <form
            onSubmit={emailform.onSubmit((data) => {
              adminClosePopup(data.email);
            })}
            className="px-10 lg:px-24"
          >
            <TextInput
              placeholder="Type email to add admin"
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
        <div className="flex w-full flex-col h-full">
          <div className="mx-[2%] lg:mt-3 max-h-screen ">
            <div className="lg:rounded-xl rounded-xl xl:h-[calc(89vh-60px)] lg:h-[calc(88vh-60px)] md:h-[calc(89vh-55px)]  h-[calc(88vh-50px)] overflow-hidden border-[3px] border-primary mt-24 ">
              <div className="flex flex-col ">
                <div className="bg-primary lg:py-2 py-2 lg:px-5 px-3 flex flex-row w-full items-center justify-between cursor-default ">
                  <div className="flex items-start flex-col justify-center ">
                    <p className="text-white font-semibold xl:text-4xl lg:text-4xl md:text-3xl text-3xl">
                      {
                        <>
                          <p
                            className="xl:hidden lg:hidden md:hidden sm:hidden block 
                                             text-[29px]"
                          >
                            Admin
                          </p>
                          <p
                            className="xl:text-4xl lg:text-4xl md:text-3xl  sm:text-3xl
                                  ˝         xl:block lg:block md:block sm:block hidden"
                          >
                            Admin Dashboard
                          </p>
                        </>
                      }
                    </p>

                    <p className="text-white font-semibold xl:text-xl lg:text-xl md:text-lg text-base">
                      {formatDate(currentDate)}
                    </p>
                  </div>
                  <div
                    className=" flex lg:flex-row  md:flex-row flex-col gap-2 lg:py-4 md:py-4 py-1 items-end 
                                          lg:text-xl md:text-lg text-md text-white font-medium w-22 "
                  >
                    <div
                      className="lg:px-5 px-2 gap-1 rounded-2xl py-1 flex justify-center items-center hover:cursor-pointer hover:text-black hover:bg-white hover:shadow-md transition ease-in-out"
                      onClick={() => open()}
                    >
                      <AiOutlineUserAdd className="lg:text-3xl text-xl " />
                      <span>Add Admin</span>
                    </div>
                  </div>
                </div>
                <div
                  className="flex xl:flex-row flex-col  overflow-y-auto
                            p-5  gap-5 xl:justify-between 
                            xl:h-[calc(89vh-148px)] lg:h-[calc(88vh-148px)] md:h-[calc(89vh-140px)] h-[calc(88vh-130px)] "
                >
                  <div className="xl:flex xl:flex-col xl:w-4/6  ">
                    <form
                      onSubmit={submitForm.onSubmit((data) => {
                        handleSubmit(data);
                      })}
                      className="bg-white drop-shadow-lg border-black-70 border-[1px] rounded-xl
                               flex flex-col items-center py-5 gap-5 
                               lg:h-2/6 md:h-[180px] h-[360px] "
                    >
                      <p
                        className="xl:text-3xl lg:text-2xl md:text-xl font-semibold  text-xl
                                 xl:block lg:block md:block  text-primary xl:mt-5 cursor-default"
                      >
                        Add new semester and year
                      </p>
                      <div className="flex md:flex-row flex-col justify-center xl:gap-10 lg:gap-20 md:gap-10 gap-2">
                        <Radio.Group
                          label="Semester"
                          withAsterisk
                          size="md"
                          className=" mb-3"
                          {...submitForm.getInputProps("semester")}
                        >
                          <Group mt="xs" mb="xs">
                            <Radio value="1" label="1" />
                            <Radio value="2" label="2" />
                            <Radio value="3" label="3(Summer)" />
                          </Group>
                        </Radio.Group>

                        <TextInput
                          size="md"
                          label="Academic Year"
                          {...submitForm.getInputProps("year")}
                          type="text"
                          withAsterisk={true}
                          placeholder="Add Year"
                        />
                        <Button
                          className=" bg-white border-green-600 text-green-600 w-[100px] hover:bg-green-600 hover:text-white hover:border-green-600 md:mt-7 mt-5 duration-200"
                          type="submit"
                        >
                          Confirm
                        </Button>
                      </div>
                    </form>
                    <div
                      className="bg-white drop-shadow-lg border-black-70 border-[1px] rounded-xl
                               flex flex-col items-center py-5 gap-5 mt-2
                              lg:h-4/6 md:h-[500px] h-[360px]"
                    >
                      <p
                        className="xl:text-3xl lg:text-2xl md:text-xl font-semibold  text-xl
                                 xl:block lg:block md:block   text-primary cursor-default"
                      >
                        Admin with access
                      </p>
                      <div
                        className="  overflow-y-auto  border-[1px] border-black-50 rounded-lg 
                                   flex xl:flex-col flex-col items-center lg:px-10 
                                   xl:h-full h-5/6
                                   xl:w-5/6 lg:w-[920px] w-5/6 md:mx-10 py-3"
                      >
                        <div className="flex flex-col gap-0">{showEmail}</div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="bg-white drop-shadow-xl border-black-70 border-[1px] rounded-xl 
                                xl:w-2/5 w-full lg:max-h-[1200px] md:max-h-[1000px] max-h-[500px]
                                flex flex-col items-center py-5 
                                    "
                  >
                    <p
                      className="xl:text-3xl lg:text-2xl md:text-xl font-semibold text-xl 
                                    xl:block md:block text-primary mb-1 cursor-default"
                    >
                      Semester currently in active
                    </p>
                    <div
                      className="py-3  overflow-y-auto  border-[1px] border-black-50 mt-5 rounded-lg 
                                   flex xl:flex-col flex-col items-center lg:px-10 
                                   xl:h-full h-full
                                   xl:w-5/6 lg:w-[920px] w-5/6 md:mx-10"
                    >
                      <div className="xl:hidden  hidden  md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-5 md:gap-4">
                        {showCurrent}
                      </div>
                      <div className="xl:block md:hidden block">
                        {showCurrent}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
