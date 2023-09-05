import React, { useContext, useEffect, useState } from "react";
import "./signIn.css";
import { ROLE, UserInfoContext } from "../context";

const ErrorView = () => {
  const pathname = window.location.pathname;
  const {userInfo} = useContext(UserInfoContext)
  const getCurrentDimension = () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);

  useEffect(() => {
    if (
      userInfo.itAccountType === ROLE.INSTRUCTOR &&
      pathname === "/errorView" &&
      (screenSize.width >= 1200 && screenSize.height >= 500)
    ) {
      window.location.replace("/sign-in");
    }
  }, [screenSize]);

  return (
    <div>
      <div className="popuplogin">
        <div className="topictext">SCORE ANNOUNCEMENT </div>
        <div className="logintext">ลงชื่อเข้าสู่ระบบ</div>
      </div>
    </div>
  );
};

export default ErrorView;
