import { ShowSidebarContext } from "../context";
import React, { useState, useEffect, useContext } from "react";
import secMan from "./css/manage.module.css";
import TableScore from "./TableScore";
import Course from "../pages/css/course166.module.css";

const Management = ({ data }) => {
  const [isShowTable, setIsShowTable] = useState(false);
  const [dataTable, setDataTable] = useState();
  const { showSidebar } = useContext(ShowSidebarContext);
  const [isSelectedSec, setIsSelectSec] = useState(false);

  const showTable = (sec) => {
    setIsSelectSec(true)
    setIsShowTable(true);
    setDataTable(data.filter((e) => e.section === sec)[0].scores);
  };

  useEffect(() => {
    data.sort((a, b) => a.section - b.section);
  }, [data]);

  return (
    <div>
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
          {/**Publish All Sections */}
          <div className={Course.publishlAll}>
            <p>Publish All Sections</p>
          </div>
          {/**Publish Each Sections */}
          <div className={Course.publishlEach}>
            <p>Publish Each Section</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;