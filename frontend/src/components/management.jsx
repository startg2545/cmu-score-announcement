import React, { useState, useEffect, useContext } from "react";
import secMan from "./css/manage.module.css";

const Management = ({ data }) => {
  useEffect(() => {
    console.log(data);
  }, []);

  return (
    <div>
      <div className={secMan.layOut}></div>
      {data.map((e, key) => (
        <p className={secMan.secBox} key={key}>
          Section {e.section < 10 ? `00${e.section}`: e. section < 100 ? `0${e.section}`: e.section}
        </p>
      ))}

    </div>
  );
};

export default Management;
