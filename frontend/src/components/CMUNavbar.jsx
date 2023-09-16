import React, { useEffect, useState, useContext } from "react";
import { Flex, Text, Menu } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { ROLE, ShowSidebarContext, UserInfoContext } from "../context";
import { CheckPermission } from "../utility/main";
import { signOut } from "../services";
import { useMediaQuery } from "@mantine/hooks";
import cmulogo from "../image/cmulogo2.png";
import style from "./css/component.module.css";
import { FaSignOutAlt } from "react-icons/fa";
import { BsSunFill, BsFillMoonStarsFill } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { PiSidebarSimpleFill } from "react-icons/pi";
import { Link } from "react-router-dom";

const CMUNavbar = () => {
  const { handleSidebarClick } = useContext(ShowSidebarContext);
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const { pathname } = useLocation();
  const withoutNavbar = ["/sign-in", "/cmuOAuthCallback", "/errorView"];
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const isMobileOrTablet = useMediaQuery(
    "(max-width: 1024px) and (max-height: 1400px)"
  );
  const svgWidth = isMobileOrTablet ? "24px" : "40px";

  // useEffect(() => {
  //   if(userInfo.itAccountType) {
  //     const check = async () => {
  //       const isPermission = await CheckPermission(userInfo.itAccountType, pathname);
  //       if (!isPermission) {
  //         setUserInfo(null);
  //         await signOut().finally(navigate("/sign-in"));
  //       };
  //     };
  //     check();
  //   }
  // },[pathname, userInfo, navigate])
  const [sidebar, setSidebar] = useState(false);
  const handleSidebar = () => {
    setSidebar(!sidebar);
    handleSidebarClick(true);
  };
  const navToSemesterYear = (semester, year) => {
    navigate({
      pathname: "/course",
      search: `?semester=${semester}&year=${year}`,
    });
  };
  const handleSemesterYear = (semester, year) => {
    setSidebar(!sidebar);
    handleSidebarClick(true);
    navToSemesterYear(semester, year);
  };

  const courseData = [
    { semester: 1, year: 66 },
    { semester: 3, year: 65 },
    { semester: 2, year: 65 },
    { semester: 1, year: 65 },
  ];
  if (withoutNavbar.some((path) => pathname.includes(path))) return null;
  const userRole = userInfo.itAccountType !== "MISEmpAcc" ? "hidden" : "flex";

  return (
    <>
      <div
        className="flex w-full fixed justify-between items-center top-0 bg-primary px-5 lg:px-10 md:px-8"
        //navbar wrapper
      >
        <div
          className={
            sidebar
              ? "absolute left-0 top-[65px] md:top-[60px] lg:top-[76px] justify-center lg:w-[17%] w-full h-full items-center z-50 drop-shadow-xl duration-[480ms] bg-white"
              : "absolute -left-[150%] top-[65px] md:top-[60px] lg:top-[76px] lg:w-[17%] w-full h-full z-50 duration-1000 "
          }
          style={{
            boxShadow: "5px 3px 10px rgba(0,0,0,0.25)",
          }}
        >
          <div className="flex flex-col rounded-md min-h-screen h-full">
            <div className="flex flex-col py-10 gap-5">
              <ul className="flex flex-col gap-5 pt-5 pb-10 text-gray-800 justify-center items-center font-semibold">
                {courseData.map((data, i) => (
                  <li
                    className="flex cursor-pointer text-center gap-1 text-2xl items-center hover:bg-gray-100 duration-300 px-7 py-2 rounded-xl"
                    key={i}
                  >
                    <div
                      onClick={() => {
                        handleSemesterYear(data.semester, `25${data.year}`);
                      }}
                    >
                      Course {data.semester}/{data.year}
                    </div>
                  </li>
                ))}
              </ul>
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
            <PiSidebarSimpleFill className="text-white text-4xl hover:text-black" />
          </div>
          <a href="/">
            <img
              src={cmulogo}
              alt="CMULogo"
              className="w-32 lg:w-44 drop-shadow-lg"
              // CMU Logo Navbar
            />
          </a>
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
                        <Text
                          className="text-white group-hover:text-gray-200 lg:text-xl md:text-lg font-bold drop-shadow"
                          style={{
                            fontFamily: "'SF PRo', sans-serif",
                          }}
                        >
                          Hello, {userInfo.firstName.charAt(0).toUpperCase()}
                          {userInfo.firstName.slice(1).toLowerCase()}{" "}
                          {userInfo.lastName &&
                            userInfo.lastName.charAt(0).toUpperCase()}
                          .
                        </Text>
                        <Text
                          className="text-[#f7c878] group-hover:text-[#e6bd76] lg:text-xl md:text-lg drop-shadow text-end"
                          style={{
                            fontFamily: "'SF PRo', sans-serif",
                          }}
                        >
                          1/66,{" Student"}
                        </Text>
                      </div>
                      <IoMdArrowDropdown className="text-3xl text-white group-hover:text-gray-200" />
                    </div>
                  </Flex>
                </Menu.Target>
                <Menu.Dropdown className="border-red-500 fade-bottom transition-all border-[3px] p-0 m-3">
                  <Menu.Item
                    ff={"SF PRo, sans-serif"}
                    onClick={() => signOut().finally(navigate("/sign-in"))}
                    className="px-3 py-1"
                  >
                    <div className="text-lg font-bold text-red-500 flex items-center gap-3">
                      Log out
                      <FaSignOutAlt />
                    </div>
                  </Menu.Item>
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
                        <Text
                          className="text-white 2xl:text-2xl xl:text-xl lg:text-lg font-bold drop-shadow"
                          style={{
                            fontFamily: "'SF PRo', sans-serif",
                          }}
                        >
                          Hello, {userInfo.firstName.charAt(0).toUpperCase()}
                          {userInfo.firstName.slice(1).toLowerCase()}{" "}
                          {userInfo.lastName &&
                            userInfo.lastName.charAt(0).toUpperCase()}
                          .
                        </Text>
                        <Text
                          className="text-[#f7c878] group-hover:text-[#e6bd76] 2xl:text-xl xl:text-lg lg:text-md md:text-sm drop-shadow text-end"
                          style={{
                            fontFamily: "'SF PRo', sans-serif",
                            fontWeight: "500",
                          }}
                        >
                          1/66,{" Instructor"}
                        </Text>
                      </div>
                    </div>
                  </Flex>
                </Menu.Target>
              </Menu>
            ))}
        </div>
      </div>
    </>
  );
};

export default CMUNavbar;
