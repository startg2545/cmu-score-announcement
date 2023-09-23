import React, { useState, useContext, useEffect } from "react";
import { Flex, Text, Menu } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ROLE,
  StateContext,
  UserInfoContext,
  CurrentContext,
} from "../context";
import { signOut, getCurrent } from "../services";
import cmulogo from "../image/cmulogo2.png";
import { FaSignOutAlt } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { PiSidebarSimpleFill } from "react-icons/pi";
import { HiChevronRight } from "react-icons/hi";
import { CheckPermission } from "../utility/main";

const CMUNavbar = () => {
  const { handleSidebarClick } = useContext(StateContext);
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const { current } = useContext(CurrentContext);
  const { pathname } = useLocation();
  const withoutNavbar = ["/sign-in", "/cmuOAuthCallback", "/errorView"];
  const navigate = useNavigate();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // Sidebar
  const handleSidebar = () => {
    setMobileSidebar(!mobileSidebar);
    handleSidebarClick(true);
  };

  const navToSemesterYear = (semester, year) => {
    navigate({
      pathname: "/course",
      search: `?semester=${semester}&year=${year}`,
    });
  };
  const handleSemesterYear = (semester, year) => {
    setMobileSidebar(!mobileSidebar);
    handleSidebarClick(true);
    navToSemesterYear(semester, year);
  };

  if (withoutNavbar.some((path) => pathname.includes(path))) return null;
  const userRole = userInfo.itAccountType !== "MISEmpAcc" ? "hidden" : "flex";

  return (
    <>
      <nav
        className="flex w-full fixed justify-between items-center top-0 bg-primary px-3 lg:px-10 md:px-8 z-50"
        //navbar wrapper
      >
        <div
          className={
            mobileSidebar
              ? "absolute lg:hidden md::hidden left-0 top-[65px] md:top-[60px] lg:top-[76px] justify-center w-full h-max items-center z-50 drop-shadow-xl duration-[600ms] bg-white"
              : "absolute lg:hidden md::hidden -left-[150%] top-[65px] md:top-[60px] lg:top-[76px] w-full h-max z-50 duration-[2000ms]"
          }
          style={{
            boxShadow: "5px 3px 10px rgba(0,0,0,0.25)",
          }}
          //Mobile Only Sidebar
        >
          <div className="flex flex-col rounded-md min-h-screen h-full justify-between">
            <div className="flex flex-col py-2">
              <ul className="flex flex-col gap-3 pt-5 pb-10 text-gray-800 justify-center text-center items-center font-semibold mx-3">
                {current?.map ((data, i) => (
                  <li
                    className="w-full justify-center flex cursor-pointer gap-1 text-2xl items-center hover:bg-[#D0CDFE] duration-300 px-5 py-2 rounded-xl "
                    key={i}
                  >
                    <HiChevronRight />
                    <div
                      onClick={() => {
                        handleSemesterYear(data.semester, data.year);
                      }}
                    >
                      Course {data.semester}/{data.year.toString().slice(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="cursor-pointer mb-28 px-14">
              <div
                onClick={() => signOut().finally(navigate("/sign-in"))}
                className="text-2xl font-bold hover:bg-red-500 shadow-md duration-200 text-center rounded-lg mt-5 px-12 py-1 justify-center border-[3px] border-red-500 text-red-500 flex items-center gap-3 hover:cursor-pointer hover:text-white"
              >
                Log out
                <FaSignOutAlt />
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-2 lg:gap-5 md:gap-4"
          //navbar left content
        >
          <div
            onClick={() => handleSidebar()}
            className={userRole + " items-center cursor-pointer"}
          >
            <PiSidebarSimpleFill className="text-white text-4xl md:text-[42px] lg:text-5xl hover:text-black" />
          </div>

          <img
            src={cmulogo}
            alt="CMULogo"
            className="lg:w-52 md:w-44 w-36 drop-shadow-lg"
            // CMU Logo Navbar
          />
        </div>
        <div
          className="py-2"
          //navbar right content
        >
          {(userInfo &&
            userInfo.firstName &&
            userInfo.itAccountType === ROLE.STUDENT && (
              <Menu>
                <Menu.Target>
                  <Flex
                    gap="5px"
                    align="flex-end"
                    direction="column"
                    className="cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <Text className="text-white group-hover:text-gray-200 lg:text-xl md:text-lg text-xs font-bold drop-shadow text-end">
                          Hello, {userInfo.firstName.charAt(0).toUpperCase()}
                          {userInfo.firstName.slice(1).toLowerCase()}{" "}
                          {userInfo.lastName &&
                            userInfo.lastName.charAt(0).toUpperCase()}
                          .
                        </Text>
                        <Text className="text-[#f7c878] group-hover:text-[#e6bd76] lg:text-xl md:text-lg drop-shadow text-end sm:text-sm">
                          1/66,{" Student"}
                        </Text>
                      </div>
                      <IoMdArrowDropdown className="text-3xl text-white " />
                    </div>
                  </Flex>
                </Menu.Target>
                <Menu.Dropdown className="border-red-500 fade-bottom transition-all hover:bg-red-500 border-[3px] rounded-xl p-0 m-3 group">
                  <button
                    onClick={() => signOut().finally(navigate("/sign-in"))}
                    className="px-3 py-1"
                  >
                    <div className="text-xl font-bold text-red-500 group-hover:text-white flex items-center gap-3 px-10">
                      Log out
                      <FaSignOutAlt />
                    </div>
                  </button>
                </Menu.Dropdown>
              </Menu>
            )) ||
            (userInfo.itAccountType === ROLE.INSTRUCTOR && (
              <Menu>
                <Menu.Target>
                  <Flex
                    gap="5px"
                    align="flex-end"
                    direction="column"
                    className="cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <Text className="text-white 2xl:text-2xl xl:text-xl lg:text-lg md:text-base text-xs font-bold drop-shadow text-end ">
                          Hello, {userInfo.firstName.charAt(0).toUpperCase()}
                          {userInfo.firstName.slice(1).toLowerCase()}{" "}
                          {userInfo.lastName &&
                            userInfo.lastName.charAt(0).toUpperCase()}
                          .
                        </Text>
                        <Text className="text-[#f7c878] group-hover:text-[#e6bd76] 2xl:text-xl xl:text-lg lg:text-md md:text-sm drop-shadow text-end ">
                          1/66,{" Instructor"}
                        </Text>
                      </div>
                    </div>
                  </Flex>
                </Menu.Target>
              </Menu>
            ))}
        </div>
      </nav>
    </>
  );
};

export default CMUNavbar;
