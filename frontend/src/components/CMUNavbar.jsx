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
import { HiChevronRight } from "react-icons/hi";

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
        className="flex w-full fixed justify-between items-center top-0 bg-primary px-5 lg:px-10 md:px-8 "
        //navbar wrapper
      >
        <div
          className={
            sidebar
              ? "absolute left-0 top-[65px] md:top-[60px] lg:top-[76px] justify-center lg:w-[14%] md:w-[20%] w-full h-max items-center z-50 drop-shadow-xl duration-[600ms] bg-white"
              : "absolute -left-[150%] top-[65px] md:top-[60px] lg:top-[76px] lg:w-[17%] w-full h-max z-50 duration-[2000ms]"
          }
          style={{
            boxShadow: "5px 3px 10px rgba(0,0,0,0.25)",
          }}
        >
          <div className="flex flex-col rounded-md min-h-screen h-full">
            <div className="flex flex-col py-2">
              <ul className="flex flex-col gap-3 pt-5 pb-10 text-gray-800 justify-center text-center items-center font-semibold mx-3">
                {courseData.map((data, i) => (
                  <li
                    className="w-full justify-center flex cursor-pointer gap-1 text-2xl items-center hover:bg-[#D0CDFE] duration-300 px-5 py-2 rounded-xl "
                    key={i}
                  >
                    <HiChevronRight />
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
            <div
              onClick={() => signOut().finally(navigate("/sign-in"))}
              className={style.logoutButton}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="22"
                viewBox="0 0 29 25"
                fill="none"
              >
                <path
                  d="M28.5986 13.6059L18.9315 24.5416C18.0684 25.518 16.5723 24.8345 16.5723 23.435V17.186H8.74647C7.98115 17.186 7.36544 16.4895 7.36544 15.6238V9.37483C7.36544 8.50909 7.98115 7.81259 8.74647 7.81259H16.5723V1.56362C16.5723 0.170627 18.0626 -0.519362 18.9315 0.457038L28.5986 11.3927C29.1338 12.0046 29.1338 12.994 28.5986 13.6059ZM11.0482 24.2161V21.6124C11.0482 21.1828 10.7374 20.8313 10.3577 20.8313H5.52408C4.50558 20.8313 3.68272 19.9004 3.68272 18.7483V6.25035C3.68272 5.09819 4.50558 4.16736 5.52408 4.16736H10.3577C10.7374 4.16736 11.0482 3.81585 11.0482 3.38624V0.782505C11.0482 0.352889 10.7374 0.00138444 10.3577 0.00138444H5.52408C2.47433 0.00138444 0 2.8004 0 6.25035V18.7483C0 22.1982 2.47433 24.9972 5.52408 24.9972H10.3577C10.7374 24.9972 11.0482 24.6457 11.0482 24.2161Z"
                  fill={isHovered ? "#fff" : "#ed4040"}
                />
              </svg>
              Log out
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
