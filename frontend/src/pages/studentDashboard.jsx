import "./studentDashboard.css";
import React, { useContext, useState, useEffect } from "react";
import { StudentSidebar } from "../components";
import { ShowSidebarContext } from "../context";

const StudentDashboard = () => {
  const { showSidebar, handleSidebarClick } = useContext(ShowSidebarContext);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  const [currentDate] = useState(new Date());

  // Function to format the date as "XX Aug, 20XX"
  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const notificationData = [
    {
      stucourseName: "261497",
      stucourseNameDate: "1 Jul",
      stucourseNameDetail: "Frontend design has been graded",
    },
    {
      stucourseName: "261216",
      stucourseNameDate: "27 Jun",
      stucourseNameDetail: "Frontend design has been graded",
    },
    {
      stucourseName: "261336",
      stucourseNameDate: "22 Jun",
      stucourseNameDetail: "Lab2 has been graded",
    },
    {
      stucourseName: "261217",
      stucourseNameDate: "19 Jun",
      stucourseNameDetail: "HW1 has been graded",
    },
    {
      stucourseName: "261498",
      stucourseNameDate: "14 Jun",
      stucourseNameDetail: "HW1 has been graded",
    },
    {
      stucourseName: "261497",
      stucourseNameDate: "6 Jun",
      stucourseNameDetail: "HW1 has been graded",
    },
    {
      stucourseName: "261200",
      stucourseNameDate: "3 Jun",
      stucourseNameDetail: "HW1 has been graded",
    },
  ];

  return (
    <>
      <StudentSidebar />
      <div
        className={`stucoursetopictext ${showSidebar ? "move-right" : ""}`}
      >
        {" "}
        Dashboard{" "}
      </div>
      <div
        className={`studatetext ${showSidebar ? "move-right" : ""}`}
      >
        {" "}
        {formatDate(currentDate)}
      </div>
      <div
        className={`stuNotiFrame ${showSidebar ? "shrink" : ""}`}
        style={{ gap: 15 }}
      >
        {notificationData.map((notification, index) => (
          <div
            className={`stuNotiBox  ${
              selectedNotification === notification ? "selected" : ""
            }`}
            key={index}
            onClick={() => handleNotificationClick(notification)}
          >
            {notification.stucourseName &&
              notification.stucourseNameDate &&
              notification.stucourseNameDetail && (
                <div>
                  <div className="stucourseName">
                    {notification.stucourseName}
                  </div>
                  <div className="stucourseNameDate">
                    {notification.stucourseNameDate}
                  </div>
                </div>
              )}
            {notification.stucourseNameDetail && (
              <div className="stucourseNameDetail">
                {notification.stucourseNameDetail}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={`stuDaframewindow ${showSidebar ? "shrink" : ""}`}>
        {selectedNotification ? (
          <p className="stuStartText">Score is shown</p>
        ) : (
          <p className="stuStartText">No Notification Selected</p>
        )}
      </div>
    </>
  );
};

export default StudentDashboard;
