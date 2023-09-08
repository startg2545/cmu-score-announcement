import React, { useState, useEffect, useContext } from "react";
import secMan from "./css/manage.module.css";

import TableScore from "./TableScore";

const Management = ({ data , dataTable}) => {
 const [isShowTable , setIsShowTable] = useState(false);
//  const [isSelectSec , setIsSelectSec] = useState(false);

 const showTable = () => {
    setIsShowTable(true);
 };
 
  return (
    <div>
        {!isShowTable&&
           <div className={secMan.layOut}>
           {data.map((e, key) => (
               <p className={secMan.secBox} key={key}
               onClick={() => {
                 showTable()
               }}>
                 Section
                 {e.section < 10
                   ? `00${e.section}`
                   : e.section < 100
                   ? `0${e.section}`
                   : e.section}
               </p>
           ))}
           </div>
        }
      
      {isShowTable &&  <TableScore data={dataTable} />}
    </div>
   
  );
};

export default Management;
