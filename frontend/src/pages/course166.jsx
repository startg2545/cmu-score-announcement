import React, { useState, useEffect } from 'react';
import './course166.css';
import SideBar from "../components/SideBar";
import CMUNavbar from "../components/CMUNavbar";


export default function Course166Container() {
  const [showSsSidebar, setShowSsSidebar] = useState(false);

  const handleSidebarClick = () => {
      setShowSsSidebar(!showSsSidebar);
    };
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
   
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);


  // Function to format the date as "XX Aug, 20XX"
  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const [isHovered, setIsHovered] = useState(false);

    return (
      <>
        <CMUNavbar showSidebar={showSsSidebar} setShowSidebar={setShowSsSidebar} />
        <SideBar showSidebar={showSsSidebar} setShowSidebar={setShowSsSidebar} />
       
          <div className={`c166coursetopictext ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick}> Course 1/66 </div>
          <div className={`c166datetext ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick}> {formatDate(currentDate)}</div>
          <div className='c166AddCourseButton' onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 29" fill="none">
                <path d="M29.8438 14.5C29.8438 14.96 29.6561 15.4011 29.322 15.7264C28.988 16.0516 28.5349 16.2344 28.0625 16.2344H16.7812V27.2188C16.7812 27.6787 16.5936 28.1199 16.2595 28.4451C15.9255 28.7704 15.4724 28.9531 15 28.9531C14.5276 28.9531 14.0745 28.7704 13.7405 28.4451C13.4064 28.1199 13.2188 27.6787 13.2188 27.2188V16.2344H1.9375C1.46508 16.2344 1.01202 16.0516 0.677966 15.7264C0.343917 15.4011 0.15625 14.96 0.15625 14.5C0.15625 14.04 0.343917 13.5989 0.677966 13.2736C1.01202 12.9484 1.46508 12.7656 1.9375 12.7656H13.2188V1.78125C13.2188 1.32127 13.4064 0.88012 13.7405 0.554862C14.0745 0.229603 14.5276 0.046875 15 0.046875C15.4724 0.046875 15.9255 0.229603 16.2595 0.554862C16.5936 0.88012 16.7812 1.32127 16.7812 1.78125V12.7656H28.0625C28.5349 12.7656 28.988 12.9484 29.322 13.2736C29.6561 13.5989 29.8438 14.04 29.8438 14.5Z" fill={isHovered ? "white" : "#8084C8"} />
              </svg>
            </div>
            <p style={{fontSize: '20px', fontWeight: '600', textIndent: '35px'}}> Add Course</p>
          </div>
          <div className={`c166courseframewindow ${showSsSidebar ? 'shrink' : ''}`} style={{ gap: 25 }}>
            {Array.from([
              "261207 - BASIC COMP ENGR LAB",
              "261405 - ADV COMPUTER ENGR TECH",
              "261494 - SEL TOPIC IN COMP ENGR",
              "261497 - SEL TOPIC IN COMP SOFT",
              "269497 - SEL TOPIC IN IS 2",
            ], (item, index) => (
            <div key={index} className='c166frameEachCourse'>
              <div className='c166courseName'>

                <div className='c166intoCourse'>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="30"
                    viewBox="0 0 19 30"
                    fill="none"
                  >
                    <path
                      d="M19.8367 16.6865L6.61282 29.1352C5.69882 29.9956 4.22086 29.9956 3.31659 29.1352L1.11909 27.0665C0.205094 26.2061 0.205094 24.8148 1.11909 23.9635L10.4925 15.1396L1.11909 6.31575C0.205094 5.45534 0.205094 4.06402 1.11909 3.21276L3.30686 1.12578C4.22086 0.265364 5.69882 0.265364 6.6031 1.12578L19.8269 13.5744C20.7507 14.4348 20.7507 15.8261 19.8367 16.6865Z"
                      fill="white"
                    />
                  </svg>
                {item}
                </div>
              </div>
            </div>
          ))}
        </div>
    </>
  );
}
