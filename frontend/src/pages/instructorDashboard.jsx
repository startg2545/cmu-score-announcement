import React, { useState } from "react";
import "./instructorDashboard.css";
import SideBar from "../components/SideBar";
import CMUNavbar from "../components/CMUNavbar";

export default function Dashboard() {
  const [showSsSidebar, setShowSsSidebar] = useState(false);

  return (
    <>
      <CMUNavbar showSidebar={showSsSidebar} setShowSidebar={setShowSsSidebar} />
      <SideBar showSidebar={showSsSidebar} setShowSidebar={setShowSsSidebar} />
      <div className="insDaframewindow-container">
        {/* Conditionally render the sssidebar */}
        <div className={`insDaframewindow ${showSsSidebar ? "shrink" : ""}`}>
          <p className="insDastartstyle">
            {showSsSidebar
              ? "Please select academic year"
              : "Click icon at the top left corner"}
            <br />
            {showSsSidebar && "in the sidebar menu"}
            {!showSsSidebar && "to select academic year"}
          </p>
        </div>
      </div>
    </>
  );
}
