import React, { useState } from "react";
import "./instructorDashboard.css";
import SideBar from "../components/SideBar";

export default function Dashboard({ showSidebar, setShowSidebar }) {

  return (
    <>
      <SideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="insDaframewindow-container">
        {/* Conditionally render the sssidebar */}
        <div className={`insDaframewindow ${showSidebar ? "shrink" : ""}`}>
          <p className="insDastartstyle">
            {showSidebar
              ? "Please select academic year"
              : "Click icon at the top left corner"}
            <br />
            {showSidebar && "in the sidebar menu"}
            {!showSidebar && "to select academic year"}
          </p>
        </div>
      </div>
    </>
  );
}
