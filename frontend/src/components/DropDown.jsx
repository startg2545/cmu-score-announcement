import React, { useState, useRef, useEffect } from "react";
import styleDrop from "./css/dropdown.module.css";

const DropDown = () => {
  const [isDropDown, setDropDown] = useState(false);
  const [isSelectSec, setSelectSec] = useState("Select Section");
  const sections = ['001', '002', '003', '004', '005', '006', '007', '008', '009',
  '701', '702', '703', '704', '705', '706', '707', '708', '709',
  '801', '802', '803', '804', '805', '806', '807', '808', '809']


  const onClickDropDown = () => {
    setDropDown(!isDropDown);
  };
  const onClickSection = (sec) => {
    console.log(sec)
    setSelectSec(sec);
    setDropDown(false);
  };

  //close when click outside
  const menuRef = useRef();
  useEffect(() => {
    document.addEventListener("mousedown", (event) => {
      if (!menuRef.current.contains(event.target)) {
        setDropDown(false);
      }
    });
  }, []);
  const styleArrow = {
    transform: isDropDown ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.2s ease",
  };

  return (
    <div className={styleDrop.boxdrop} ref={menuRef}>
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
        <ul className={ `${styleDrop.sec_menu} ${styleDrop.scroll}`}>
          {sections.map(function(data, key) {
            return (
              <li className={`${styleDrop.option} ${styleDrop.font}`}
              onClick={() => onClickSection("Section 001")} key={key}>{data}</li>
            )
          })}
          {/* <li
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
            onClick={() => onClickSection("Section 003")}
          >
            Section 003
          </li>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 004")}
          >
            Section 004
          </li>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 005")}
          >
            Section 005
          </li>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 006")}
          >
            Section 006
          </li>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 007")}
          >
            Section 007
          </li>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 008")}
          >
            Section 008
          </li>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 009")}
          >
            Section 009
          </li>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 010")}
          >
            Section 010
          </li>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 011")}
          >
            Section 011
          </li>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 012")}
          >
            Section 012
          </li>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 013")}
          >
            Section 013
          </li>
          <li
            className={`${styleDrop.option} ${styleDrop.font}`}
            onClick={() => onClickSection("Section 801")}
          >
            Section 801
          </li> */}
        </ul>
      )}
    </div>
  );
};
export default DropDown;
