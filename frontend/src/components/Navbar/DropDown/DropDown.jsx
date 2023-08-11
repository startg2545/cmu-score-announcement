import React, { useState } from "react";
import styleDrop from "./dropdown.module.css";

const DropDown = () => {
  const [isDropDown, setDropDown] = useState(false);
  const [isSelectSec, setSelectSec] = useState("Select Section");

  const onClickDropDown = () => {
    setDropDown(!isDropDown);
  };
  const onClickSection = (sec) => {
    setSelectSec(sec);
    setDropDown(false);
  };

  const styleArrow = {
    transform: isDropDown ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.2s ease",
  };

  
return (
    <div className={styleDrop.boxdrop}>
      <div>
        <p className={`${styleDrop.box_select} ${styleDrop.font}`}>
          {isSelectSec ? isSelectSec : "Select section"}
          <svg
            onClick={onClickDropDown}
            style={styleArrow}
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="14"
            viewBox="0 0 26 16"
            fill="none"
          >
            <path
              d="M1.96317 2.00391L13.4632 13.0039L24.9632 2.00391"
              stroke="black"
              strokeWidth="3"
            />
          </svg>
        </p>
      </div>

      {isDropDown && (
        <ul className={styleDrop.sec_menu}>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 001")}
          >
            Section 001
          </li>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 002")}
          >
            Section 002
          </li>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 801")}
          >
            Section 801
          </li>
        </ul>
      )}
    </div>
  );
};
export default DropDown;
