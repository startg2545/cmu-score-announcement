import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styleDrop from "./css/dropdown.module.css";

const DropDown = () => {
  const [searchParams, setSearchParams] = useSearchParams({});
  const [isDropDown, setDropDown] = useState(false);
  const [isSelectSec, setSelectSec] = useState("Select Section");
  const sections = [
    "001",
    "002",
    "003",
    "004",
    "005",
    "006",
    "007",
    "008",
    "009",
    "701",
    "702",
    "703",
    "704",
    "705",
    "706",
    "707",
    "708",
    "709",
    "801",
    "802",
    "803",
    "804",
    "805",
    "806",
    "807",
    "808",
    "809",
  ];

  const onClickDropDown = () => {
    setDropDown(!isDropDown);
  };
  const onClickSection = (sec) => {
    setSelectSec(sec);
    setDropDown(false);
    searchParams.set("section", sec);
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
        <ul className={`${styleDrop.sec_menu} ${styleDrop.scroll}`}>
          {sections.map(function (data, key) {
            return (
              <li
                className={`${styleDrop.option} ${styleDrop.font}`}
                onClick={() => onClickSection(data)}
                key={key}
              >
                {data}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default DropDown;
