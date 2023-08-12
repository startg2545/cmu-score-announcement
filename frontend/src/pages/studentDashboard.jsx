import "./studentDashboard.css";
import React, { useState } from "react";
import StudentSideBar from "../components/StudentSidebar";
import CMUNavbar from "../components/CMUNavbar";

const StudentDashboard = () => {

  const [showSsSidebar, setShowSsSidebar] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };


  const handleSidebarClick = () => {
    setShowSsSidebar(!showSsSidebar);
  };
  const [currentDate] = useState(new Date());

  // Function to format the date as "XX Aug, 20XX"
  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const notificationData = [
    {
      stucourseName: '261497',
      stucourseNameDate: '1 Jul',
      stucourseNameDetail: 'Frontend design has been graded'
    },
    {
      stucourseName: '261216',
      stucourseNameDate: '27 Jun',
      stucourseNameDetail: 'Frontend design has been graded'
    },
    {
      stucourseName: '261336',
      stucourseNameDate: '22 Jun',
      stucourseNameDetail: 'Lab2 has been graded'
    },
    {
      stucourseName: '261217',
      stucourseNameDate: '19 Jun',
      stucourseNameDetail: 'HW1 has been graded'
    },
    {
      stucourseName: '261498',
      stucourseNameDate: '14 Jun',
      stucourseNameDetail: 'HW1 has been graded'
    },
    {
      stucourseName: '261497',
      stucourseNameDate: '6 Jun',
      stucourseNameDetail: 'HW1 has been graded'
    },
    {
      stucourseName: '261200',
      stucourseNameDate: '3 Jun',
      stucourseNameDetail: 'HW1 has been graded'
    },
  ];
  

  return (
    <>
      <CMUNavbar showSidebar={showSsSidebar} setShowSidebar={setShowSsSidebar} />
      <StudentSideBar showSidebar={showSsSidebar} setShowSidebar={setShowSsSidebar} />
      <div className={`stucoursetopictext ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick}> Dashboard </div>
      <div className={`studatetext ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick}> {formatDate(currentDate)}</div>
      <div className={`stuNotiFrame ${showSsSidebar ? 'shrink' : ''}`} onClick={handleSidebarClick} style={{ gap: 15 }}>
        {notificationData.map((notification, index) => (
          <div className={`stuNotiBox  ${selectedNotification === notification ? 'selected' : ''}`} key={index} onClick={() => handleNotificationClick(notification)}>
            {notification.stucourseName && notification.stucourseNameDate && notification.stucourseNameDetail && (
              <div>
                <div className="stucourseName">{notification.stucourseName}</div>
                <div className="stucourseNameDate">{notification.stucourseNameDate}</div>
              </div>
            )}
            {notification.stucourseNameDetail && (
              <div className="stucourseNameDetail">{notification.stucourseNameDetail}</div>
            )}
          </div>
        ))}
      </div>
      <div className={`stuDaframewindow ${showSsSidebar ? 'shrink' : ''}`}>
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
