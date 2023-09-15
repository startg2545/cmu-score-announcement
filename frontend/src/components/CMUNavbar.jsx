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
import { IoMdArrowDropdown } from "react-icons/io";

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

  if (withoutNavbar.some((path) => pathname.includes(path))) return null;
  const userRole = userInfo.itAccountType !== "MISEmpAcc" ? "hidden" : "flex";

  return (
    <div
      className="flex justify-between items-center top-0 bg-primary px-5 lg:px-10 md:px-8"
      //navbar wrapper
    >
      <div
        className="flex items-center gap-2 lg:gap-5 md:gap-4"
        //navbar left content
      >
        <div
          onClick={() => handleSidebarClick()}
          className={userRole + " items-center"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-9 lg:w-12 py-2"
            //sidebar icon size
            viewBox="0 0 256 256"
          >
            <g>
              <path
                fill="#8084C8"
                d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Z"
              />
              <path
                fill={isHovered ? "black" : "white"}
                d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Zm0 160H88V56h128v144Z"
              />
            </g>
          </svg>
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
                        //user info
                      >
                        Hello, {userInfo.firstName.charAt(0).toUpperCase()}
                        {userInfo.firstName.slice(1).toLowerCase()}{" "}
                        {userInfo.lastName &&
                          userInfo.lastName.charAt(0).toUpperCase()}
                        .
                      </Text>
                      <Text
                        className="text-[#f7c878] group-hover:text-[#e6bd76] drop-shadow text-end"
                        style={{
                          fontFamily: "'SF PRo', sans-serif",
                        }}
                      >
                        1/66,{" "}
                        {userInfo.itAccountType === "StdAcc"
                          ? "Student"
                          : "Instructor"}
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
                  className="cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <Text
                        className="text-white group-hover:text-gray-200 lg:text-xl md:text-lg font-bold drop-shadow"
                        style={{
                          fontFamily: "'SF PRo', sans-serif",
                        }}
                        //user info
                      >
                        Hello, {userInfo.firstName.charAt(0).toUpperCase()}
                        {userInfo.firstName.slice(1).toLowerCase()}{" "}
                        {userInfo.lastName &&
                          userInfo.lastName.charAt(0).toUpperCase()}
                        .
                      </Text>
                      <Text
                        className="text-[#f7c878] group-hover:text-[#e6bd76] drop-shadow text-end"
                        style={{
                          fontFamily: "'SF PRo', sans-serif",
                        }}
                      >
                        1/66,{" "}
                        {userInfo.itAccountType === "StdAcc"
                          ? "Student"
                          : "Instructor"}
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
          ))}
      </div>
    </div>
  );
};

export default CMUNavbar;
