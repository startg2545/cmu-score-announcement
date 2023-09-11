import { ShowSidebarContext } from "../context";
import { useSearchParams } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import secMan from "./css/manage.module.css";
import TableScore from "./TableScore";
import Course from "../pages/css/course166.module.css";

const Management = ({ data }) => {
  const [isShowTable, setIsShowTable] = useState(false);
  const [dataTable, setDataTable] = useState();
  const { showSidebar } = useContext(ShowSidebarContext);
  const [isSelectedSec, setIsSelectSec] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

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

  const [showPopup1, setShowPopup1] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);

  const handlePublishEachClick = () => {
    setShowPopup1(true);
    setShowPopup2(false);
  };

  const handlePublishAllClick = () => {
    setShowPopup1(false);
    setShowPopup2(true);
  };

  return (
    <>
      {showPopup1 && (
        <div className={secMan.managePopup}>
          <div className={secMan.managePopupContent}>
            <div className={secMan.managePopupContentInner}>
              <p style={{ color: "white", fontWeight: "600" }}>
                Select section to publish
              </p>
            </div>
            <button
              className={secMan.closeButton}
              onClick={() => setShowPopup1(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showPopup2 && (
        <div className={secMan.managePopup}>
          <div className={secMan.managePopupContent}>
            <div className={secMan.managePopupContentInner}>
              <p style={{ color: "white", fontWeight: "600" }}>
                Publish All Section?
              </p>
            </div>
            <button
              className={secMan.closeButton}
              onClick={() => setShowPopup2(false)}
            >
              Close
            </button>
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
            <p style={{ fontWeight: "600" }}>Publish Each Sections</p>
          </div>
          <div className={Course.publishlEach} onClick={handlePublishAllClick}>
            <p style={{ fontWeight: "600", textDecoration: "underline" }}>
              Publish All Section
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Management;
