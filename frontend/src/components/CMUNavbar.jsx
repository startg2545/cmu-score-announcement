import React, { useEffect, useState, useContext } from "react";
import { Text } from "@mantine/core"; // Removed Paper
import { useLocation, useNavigate } from "react-router-dom";
import { ShowSidebarContext, UserInfoContext } from "../context";
import { CheckPermission } from "../utility/main";
import { signOut } from "../services";
import { useMediaQuery } from "@mantine/hooks";

import cmulogo from "../image/cmulogo.png";

const CMUNavbar = () => {
  const { handleSidebarClick } = useContext(ShowSidebarContext);
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const { pathname } = useLocation();
  const withoutNavbar = ["/sign-in", "/cmuOAuthCallback", "/errorView"];
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const isMobileOrTablet = useMediaQuery("(max-width: 1024px) and (max-height: 1400px)");
  const svgWidth = isMobileOrTablet ? "32px" : "48px";

  useEffect(() => {
    if(userInfo.itAccountType) {
      const check = async () => {
        const isPermission = await CheckPermission(userInfo.itAccountType, pathname);
        if (!isPermission) {
          setUserInfo(null);
          await signOut().finally(navigate("/sign-in"));
        };
      };
      check();
    }
  },[pathname, userInfo, navigate])

  if (withoutNavbar.some((path) => pathname.includes(path))) return null;

  return (
    <div style={{ position: "relative", height: 80, background: "#8084c8", paddingLeft: 50 }}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handleSidebarClick()}
        style={{
          position: "absolute",
          top: isMobileOrTablet ? "55%" : "42%", 
          left: 30,
          transform: "translateY(-50%)",
          width: 35,
          height: 35,
          borderRadius: 4,
          backgroundColor: "#8084c8",
          cursor: "pointer",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={svgWidth}
          height={svgWidth}
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
      {/* Adjust the styles for the logo */}
      <img
        src={cmulogo}
        alt="CMULogo"
        style={{
          position: "absolute",
          top: "50%",
          left: isMobileOrTablet ? "70px" : "90px", 
          transform: "translateY(-50%)",
          width: isMobileOrTablet ? "90px" : "120px", 
          height: isMobileOrTablet ? "90px" : "120px", 
          borderRadius: 4,
        }}
      />
      {/* Use Mantine's Text component */}
      {userInfo && userInfo.firstName && (
        <Text
          style={{
            position: "absolute",
            top: isMobileOrTablet ? "30px" : "25px", 
            right: 25,
            color: "#fff",
            textAlign: "right",
            textShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            fontFamily: "'SF PRo', sans-serif",
            fontSize: isMobileOrTablet ? "18px" : "24px", 
            fontWeight: 780,
            lineHeight: "normal",
            transform: "translateY(-40%)",
          }}
        >
          Hello, {userInfo.firstName.charAt(0).toUpperCase()}
          {userInfo.firstName.slice(1).toLowerCase()}{" "}
          {userInfo.lastName && userInfo.lastName.charAt(0).toUpperCase()}.
        </Text>
      )}
   
      {userInfo && (
        <Text
          style={{
            position: "absolute",
            top: isMobileOrTablet ? "28px" : "20px", 
            right: 30,
            color: "#f7c878",
            textAlign: "right",
            fontFamily: "'SF PRo', sans-serif",
            fontSize: isMobileOrTablet ? "14px" : "18px", 
            fontWeight: 610,
            lineHeight: "normal",
            transform: "translateY(120%)",
          }}
        >
          1/66, {userInfo.itAccountType === "StdAcc" ? "Student" : "Instructor"}
        </Text>
      )}
    </div>
  );
};

export default CMUNavbar;
