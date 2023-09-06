import React, { useContext, useEffect, useState } from "react";
import "./errorView.css";
import { ROLE, UserInfoContext } from "../context";

const ErrorView = () => {
  const pathname = window.location.pathname;
  const { userInfo } = useContext(UserInfoContext);
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
      screenSize.width >= 1200 &&
      screenSize.height >= 500
    ) {
      window.location.replace("/sign-in");
    }
  }, [screenSize]);

  return (
    <div>
      <div className="popupLogin">
        <div>
          <div style={{ marginTop: "50px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 32"
              fill="none"
              width="450px"
              height="80px"
            >
              <path
                d="M18.232 16L12.366 10.134C12.1315 9.89955 11.9998 9.58156 11.9998 9.25C11.9998 8.91844 12.1315 8.60045 12.366 8.366C12.6005 8.13155 12.9184 7.99984 13.25 7.99984C13.5816 7.99984 13.8995 8.13155 14.134 8.366L20 14.232L25.866 8.366C26.1005 8.13155 26.4184 7.99984 26.75 7.99984C27.0816 7.99984 27.3995 8.13155 27.634 8.366C27.8685 8.60045 28.0002 8.91844 28.0002 9.25C28.0002 9.58156 27.8685 9.89955 27.634 10.134L21.768 16L27.634 21.866C27.7501 21.9821 27.8422 22.1199 27.905 22.2716C27.9678 22.4233 28.0002 22.5858 28.0002 22.75C28.0002 22.9142 27.9678 23.0767 27.905 23.2284C27.8422 23.3801 27.7501 23.5179 27.634 23.634C27.5179 23.7501 27.3801 23.8422 27.2284 23.905C27.0767 23.9678 26.9142 24.0002 26.75 24.0002C26.5858 24.0002 26.4233 23.9678 26.2716 23.905C26.1199 23.8422 25.9821 23.7501 25.866 23.634L20 17.768L14.134 23.634C13.8995 23.8685 13.5816 24.0002 13.25 24.0002C12.9184 24.0002 12.6005 23.8685 12.366 23.634C12.1315 23.3995 11.9998 23.0816 11.9998 22.75C11.9998 22.4184 12.1315 22.1005 12.366 21.866L18.232 16ZM0 4.75C0 3.49022 0.500445 2.28204 1.39124 1.39124C2.28204 0.500445 3.49022 0 4.75 0H35.25C36.5098 0 37.718 0.500445 38.6088 1.39124C39.4996 2.28204 40 3.49022 40 4.75V27.25C40 28.5098 39.4996 29.718 38.6088 30.6088C37.718 31.4996 36.5098 32 35.25 32H4.75C3.49022 32 2.28204 31.4996 1.39124 30.6088C0.500445 29.718 0 28.5098 0 27.25V4.75ZM4.75 2.5C4.15326 2.5 3.58097 2.73705 3.15901 3.15901C2.73705 3.58097 2.5 4.15326 2.5 4.75V27.25C2.5 27.8467 2.73705 28.419 3.15901 28.841C3.58097 29.2629 4.15326 29.5 4.75 29.5H35.25C35.8467 29.5 36.419 29.2629 36.841 28.841C37.2629 28.419 37.5 27.8467 37.5 27.25V4.75C37.5 4.15326 37.2629 3.58097 36.841 3.15901C36.419 2.73705 35.8467 2.5 35.25 2.5H4.75Z"
                fill="black"
              />
            </svg>
          </div>
          <div style={{ marginTop: "40px", justifyContent: "center", alignContent: 'center' }}>
            This website is not support your screen.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;
