import React, { useState, useEffect, useContext } from "react";
import style from "./css/component.module.css";
import cmulogo from "../image/cmulogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { ShowSidebarContext, UserInfoContext } from "../context";
import { CheckPermission } from "../utility/main";
import { signOut } from "../services";

const CMUNavbar = () => {
  const { handleSidebarClick } = useContext(ShowSidebarContext);
  const { userInfo } = useContext(UserInfoContext);
  const { pathname } = useLocation();
  const withoutNavbar = ["/sign-in"]; //can add page that would not show navbar
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(userInfo.itAccountType) {
      const check = async () => {
        const isPermission = await CheckPermission(userInfo.itAccountType, pathname);
        if (!isPermission) {
          signOut().finally(navigate("/sign-in"));
        }
      };
      check();
    }
    else if(!localStorage.getItem("role")) navigate("sign-in");
  },[pathname, userInfo, navigate])

  if (withoutNavbar.some((path) => pathname.includes(path))) return null;

  return (
    <div className={style.navbar}>
      <div
        className={style.sidebar_icon}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handleSidebarClick()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="45"
          height="45"
          viewBox="0 0 256 256"
        >
          <g>
            {/* White background path for the border */}
            <path
              fill="#8084C8"
              d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Z"
            />
            {/* Original path with the icon */}
            <path
              fill={isHovered ? "black" : "white"}
              d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Zm0 160H88V56h128v144Z"
            />
          </g>
        </svg>
      </div>
      <img src={cmulogo} alt="CMULogo" className={style.cmulogo} />
      {userInfo && userInfo.firstName && (
        <p className={style.hello}>
          Hello, {userInfo.firstName.charAt(0).toUpperCase()}
          {userInfo.firstName.slice(1).toLowerCase()}{" "}
          {userInfo.lastName && userInfo.lastName.charAt(0).toUpperCase()}.
        </p>
      )}
      {userInfo && (
        <p className={style.role}>
          1/66, {userInfo.itAccountType === "StdAcc" ? "Student" : "Instructor"}
        </p>
      )}
    </div>
  );
};

export default CMUNavbar;
