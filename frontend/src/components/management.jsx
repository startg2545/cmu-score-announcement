import { ShowSidebarContext } from "../context";
import { useSearchParams } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import secMan from "./css/manage.module.css";
import TableScore from "./TableScore";
import Course from "../pages/css/course166.module.css";
import upStyle from "./css/uploadScore.module.css";
import { Checkbox, Button } from "@mantine/core";

const Management = ({ data }) => {
  const [isShowTable, setIsShowTable] = useState(false);
  const [dataTable, setDataTable] = useState();
  const { showSidebar } = useContext(ShowSidebarContext);
  const [isSelectedSec, setIsSelectSec] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [countChecked, setCountChecked] = useState(0);

  const showTable = (sec) => {
    searchParams.set("section", sec);
    setSearchParams(searchParams);
    setIsSelectSec(true);
    setIsShowTable(true);
    setDataTable(data.filter((e) => e.section === sec)[0].scores);
  };

  useEffect(() => {
    data.sort((a, b) => a.section - b.section);
  }, [data]);

  const handlePublishAllClick = () => {
    setShowPopup2(true);
  };

  const handlePublishEachClick = () => {
    setShowPopup(true);
  };

  const handleCheckboxChange = (e) => {
    if(e.target.checked === true)
    {
      setCountChecked(countChecked + 1)
    }
    else
    {
      setCountChecked(countChecked - 1)
    }
  };

  const handleButtonClick = () => {
    if(countChecked !== 0)
    {
      setShowPopup(false);
    } 
  };

  return (
    <>
      {showPopup && (
        <div className={secMan.managePopup}>
          <div className={secMan.managePopupContent}>
            <div className={secMan.managePopupContentInner}>
              <p style={{ color: "white", fontWeight: "600" }}>
                Select section to publish
              </p>
            </div>
            
              <div>
                {data.map((e, key) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "-22px",
                    }}
                  >
                    <Checkbox
                      color="indigo"
                      size="md"
                      onChange={handleCheckboxChange}
                    />
                    <p style={{ marginLeft: "8px", fontSize: "21px" }}>
                      Section{" "}
                      {e.section < 100
                        ? `00${e.section}`
                        : e.section < 1000
                        ? `0${e.section}`
                        : e.section}
                    </p>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "15px",
                }}
              >
                <Button
                  style={{ marginRight: "20px" }}
                  className={Course.CancelPopupButton}
                  onClick={() => setShowPopup(false)}
                  radius="md"
                  sx={{
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#F0EAEA",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  style={{ marginLeft: "20px" }}
                  className={Course.AddPopupButton}
                  type="submit"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#d499ff",
                    },
                  }}
                  onClick={handleButtonClick}
                  radius="md"
                  disabled={countChecked === 0}
                >
                  Confirm
                </Button>
              </div>
         
          </div>
        </div>
      )}
      {showPopup2 && (
        <div className={secMan.managePopup}>
          <div className={secMan.managePopupContent}>
            <div className={secMan.managePopupContentInner}>
              <p style={{ color: "white", fontWeight: "600" }}>
                Publish All Sections?
              </p>
            </div>
            <div className={upStyle.ScoreSvgInline}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="90"
                height="90"
                viewBox="0 0 250 168"
                fill="none"
                transform="translate(16, 2)"
                style={{ marginTop: "-20px" }}
              >
                <path
                  d="M248 79.13C247.63 78.32 238.87 58.87 219.52 39.52C193.63 13.67 161 0 125 0C89 0 56.37 13.67 30.51 39.52C11.16 58.87 2.40002 78.32 2.00002 79.13C1.32255 80.666 0.972656 82.3263 0.972656 84.005C0.972656 85.6837 1.32255 87.344 2.00002 88.88C2.37002 89.7 11.13 109.14 30.49 128.49C56.37 154.34 89 168 125 168C161 168 193.63 154.34 219.48 128.49C238.84 109.14 247.6 89.7 247.97 88.88C248.652 87.3461 249.007 85.6869 249.012 84.0082C249.018 82.3294 248.673 80.668 248 79.13ZM201.94 112.13C180.47 133.27 154.59 144 125 144C95.41 144 69.53 133.27 48.09 112.12C39.6535 103.772 32.3964 94.3115 26.52 84C32.3981 73.6926 39.655 64.2354 48.09 55.89C69.54 34.73 95.41 24 125 24C154.59 24 180.46 34.73 201.91 55.89C210.346 64.2346 217.603 73.692 223.48 84C217.603 94.3109 210.346 103.772 201.91 112.12L201.94 112.13ZM125 40C116.298 40 107.791 42.5806 100.555 47.4153C93.3192 52.2501 87.6796 59.122 84.3493 67.1619C81.0191 75.2019 80.1477 84.0488 81.8455 92.584C83.5432 101.119 87.7338 108.959 93.8873 115.113C100.041 121.266 107.881 125.457 116.416 127.155C124.951 128.852 133.798 127.981 141.838 124.651C149.878 121.32 156.75 115.681 161.585 108.445C166.419 101.209 169 92.7024 169 84C168.987 72.3345 164.347 61.1507 156.098 52.9019C147.849 44.6532 136.665 40.0132 125 40ZM125 104C121.044 104 117.178 102.827 113.889 100.629C110.6 98.4318 108.036 95.3082 106.522 91.6537C105.009 87.9991 104.613 83.9778 105.384 80.0982C106.156 76.2186 108.061 72.6549 110.858 69.8579C113.655 67.0608 117.219 65.156 121.098 64.3843C124.978 63.6126 128.999 64.0087 132.654 65.5224C136.308 67.0362 139.432 69.5996 141.629 72.8886C143.827 76.1776 145 80.0444 145 84C145 89.3043 142.893 94.3914 139.142 98.1421C135.391 101.893 130.304 104 125 104Z"
                  fill="#2CA430"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="45"
                height="52"
                viewBox="0 0 44 40"
                fill="none"
                transform="translate(-10, 10)"
              >
                <path
                  d="M26.622 3.17771L26.6221 3.17796L42.8112 31.6836C44.794 35.1767 42.2528 39.5 38.192 39.5H5.81084C1.74691 39.5 -0.793947 35.1765 1.18874 31.6836L17.3778 3.17796C19.4058 -0.392872 24.5971 -0.392349 26.622 3.17771ZM24.4033 33.7694C25.0417 33.1371 25.4013 32.2785 25.4013 31.3822C25.4013 30.4859 25.0417 29.6273 24.4033 28.995C23.7651 28.3629 22.9005 28.0086 22 28.0086C21.0994 28.0086 20.2348 28.3629 19.5966 28.995C18.9582 29.6273 18.5987 30.4859 18.5987 31.3822C18.5987 32.2785 18.9582 33.1371 19.5966 33.7694C20.2348 34.4015 21.0994 34.7558 22 34.7558C22.9005 34.7558 23.7651 34.4015 24.4033 33.7694ZM22 7.89368C21.0994 7.89368 20.2348 8.24795 19.5966 8.88008C18.9582 9.51237 18.5987 10.371 18.5987 11.2672V19.8879C18.5987 20.7842 18.9582 21.6428 19.5966 22.2751C20.2348 22.9072 21.0994 23.2615 22 23.2615C22.9005 23.2615 23.7651 22.9072 24.4033 22.2751C25.0417 21.6428 25.4013 20.7842 25.4013 19.8879V11.2672C25.4013 10.371 25.0417 9.51237 24.4033 8.88008C23.7651 8.24795 22.9005 7.89368 22 7.89368Z"
                  fill="url(#paint0_linear_299_1210)"
                  stroke="black"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_299_1210"
                    x1="22"
                    y1="0"
                    x2="22"
                    y2="40"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#F9E5C4" stopOpacity="0.76" />
                    <stop offset="1" stopColor="#FFBB0C" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p>All scores will be published</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Button
                style={{ marginRight: "20px" }}
                className={Course.CancelPopupButton}
                onClick={() => setShowPopup2(false)}
                radius="md"
                sx={{
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#F0EAEA",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                style={{ marginLeft: "20px" }}
                className={Course.AddPopupButton}
                type="submit"
                sx={{
                  "&:hover": {
                    backgroundColor: "#d499ff",
                  },
                }}
                onClick={() => setShowPopup2(false)}
                radius="md"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
      <div
        className={` ${secMan.Managecourseframewindow}  ${
          showSidebar ? secMan.shrink : ""
        }`}
      >
        {!isShowTable && (
          <div>
            {data.map((e, key) => (
              <p
                className={secMan.secBox}
                key={key}
                onClick={() => {
                  showTable(e.section);
                }}
              >
                Section{" "}
                {e.section < 100
                  ? `00${e.section}`
                  : e.section < 100
                  ? `0${e.section}`
                  : e.section}
              </p>
            ))}
          </div>
        )}
        {isShowTable && <TableScore data={dataTable} />}
      </div>
      {!isSelectedSec && (
        <div
          className={`${Course.publishSec} ${showSidebar ? Course.shrink : ""}`}
        >
          <div className={Course.publishlAll} onClick={handlePublishEachClick}>
            <p className={secMan.fontp} style={{ fontWeight: "600" }}>Publish Each Section</p>
          </div>
          <div className={Course.publishlEach} onClick={handlePublishAllClick}>
            <p className={secMan.fontp} style={{ fontWeight: "600", textDecoration: "underline" }}>
              Publish All Sections
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Management;
