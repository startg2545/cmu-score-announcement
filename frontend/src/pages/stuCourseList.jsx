import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "./stuCourseList.css";
import { StudentSidebar } from "../components";
import { ShowSidebarContext } from "../context";

export default function StuCourseList() {
    const { showSidebar } = useContext(ShowSidebarContext);
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
        const options = { day: "numeric", month: "short", year: "numeric" };
        return date.toLocaleDateString("en-US", options);
    };

    return (
        <>
            
            <div
                className={`stuCouListcoursetopictext ${showSidebar ? 'move-right' : ''}`} 
            >
            Courses
            </div>
                <div 
                className={`stuCouListdatetext ${showSidebar ? 'move-right' : ''}`} 
            > 
            {formatDate(currentDate)}
            </div>
            <StudentSidebar />
            <div
            className={`stuCouListcourseframewindow ${showSidebar ? 'shrink' : ''}`}   
            style={{ gap: 25 }}
            >
            {Array.from(
                [
                { courseNo: 261304, courseName: "COMPUTER ARCHITECTURE", section: "001" },
                { courseNo: 261335, courseName: "COMPUTER NETWORK", section: "001" },
                { courseNo: 261336, courseName: "COMPUTER NETWORK LABORATORY", section: "001" },
                { courseNo: 261342, courseName: "FUND OF DATABASE SYSTEMS", section: "001" },
                { courseNo: 261343, courseName: "DATABASE SYSTEM LABORATORY ", section: "001" },
                { courseNo: 261497, courseName: "SEL TOPIC IN COMP SPFT ", section: "003" },
                // Add more items here as needed
                ],
                (item, index) => (
                <div
                    key={index}
                    className={`stuCouListframeEachCourse`}
                >
                    <div className={`stuCouListcourseName`}>
                    <div className={`stuCouListintoCourse`}>
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
                        {item.courseNo} - {item.courseName}  
                        <div className="stuCouListcourseSection">Section: {item.section}</div>
                    </div>
                    </div>
                </div>
                )
            )}
            </div>
        </>
    );
}
