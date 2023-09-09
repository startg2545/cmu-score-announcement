import React, { useState, useEffect, useContext } from "react";
import secMan from "./css/manage.module.css";
import { ShowSidebarContext, UserInfoContext } from "../context";
import TableScore from "./TableScore";

const Management = ({ data, dataTable }) => {
  const [isShowTable, setIsShowTable] = useState(false);
  //  const [isSelectSec , setIsSelectSec] = useState(false);

  const showTable = () => {
    setIsShowTable(true);
  };

  const { showSidebar } = useContext(ShowSidebarContext);

  return (
    <div>
      <div
        className={` ${secMan.Managecourseframewindow}  ${
          showSidebar ? secMan.shrink : ""
        }`}
      >
        {!isShowTable && (
          <div >
            {data.map((e, key) => (
              <p
                className={secMan.secBox}
                key={key}
                onClick={() => {
                  showTable();
                }}
              >
                Section
                {e.section < 100
                  ? `00${e.section}`
                  : e.section < 100
                  ? `0${e.section}`
                  : e.section}
              </p>
            ))}
            {data.map((e, key) => (
              <p
                className={secMan.secBox}
                key={key}
                onClick={() => {
                  showTable();
                }}
              >
                Section
                {e.section < 100
                  ? `00${e.section}`
                  : e.section < 100
                  ? `0${e.section}`
                  : e.section}
              </p>
            ))}
            {data.map((e, key) => (
              <p
                className={secMan.secBox}
                key={key}
                onClick={() => {
                  showTable();
                }}
              >
                Section
                {e.section < 100
                  ? `00${e.section}`
                  : e.section < 100
                  ? `0${e.section}`
                  : e.section}
              </p>
            ))}

            
          </div>
        )}
      </div>

      {isShowTable && <TableScore data={dataTable} />}
    </div>
  );
};

export default Management;
