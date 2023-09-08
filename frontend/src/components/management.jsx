import React, { useState, useEffect, useContext } from "react";
import secMan from "./css/manage.module.css";

const Management = (data) => {
  return (
    <div >
      <div className={secMan.layOut}>
        <h1 className={secMan.secBox}>Section 001</h1>
        <h1 className={secMan.secBox}>Section 002</h1>
        <h1 className={secMan.secBox}>Section 003</h1>
        <h1 className={secMan.secBox}>Section 004</h1>
        <h1 className={secMan.secBox}>Section 005</h1>
        <h1 className={secMan.secBox}>Section 006</h1>
      </div>
    </div>
  );
};

export default Management;
