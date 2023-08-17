import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styleDrop from "./css/dropdown.module.css";

const DropDownCourse = ({parentToChild}) => {
  const [searchParams, setSearchParams] = useSearchParams({});
  const [isDropDown, setDropDown] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("Select Course");

  const onClickDropDown = () => {
    setDropDown(!isDropDown);
  };
  const onClickCourse = (sec) => {
    setSelectedCourse(sec);
    setDropDown(false);
    searchParams.set("courseNo", sec);
    setSearchParams(searchParams);
  };

  //close when click outside
  const menuRef = useRef();
  useEffect(() => {
    const clickOutside = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setDropDown(false);
      }
    };

    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);
  const styleArrow = {
    transform: isDropDown ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.2s ease",
  };

  return (
    <div className={styleDrop.boxdrop} ref={menuRef}>
      <div onClick={onClickDropDown}>
        <p className={`${styleDrop.box_select} ${styleDrop.font}`}>
          {selectedCourse ? selectedCourse : "Select Course"}
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
        <ul className={`${styleDrop.sec_menu} ${styleDrop.scroll}`}>
          {parentToChild.courseDetails.map(function (data, key) {
            let courseNo = data.courseNo;
            return (
              <li
                className={`${styleDrop.option} ${styleDrop.font}`}
                onClick={() => onClickCourse(courseNo)}
                key={key}
              >
                {courseNo}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default DropDownCourse;
