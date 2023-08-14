import React, { useContext, useEffect } from "react";
import "./instructorDashboard.css";
import { SideBar } from "../components";
import { ShowSidebarContext } from "../context";

export default function Dashboard() {
  const { showSidebar } = useContext(ShowSidebarContext);

  return (
    <>
      <SideBar />
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
