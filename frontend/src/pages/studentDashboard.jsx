import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "./studentDashboard.css";
import { StudentSidebar } from "../components";
import { ShowSidebarContext } from "../context";

export default function StudentDashboard() {
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
        <div className="boxTop">
            <div className="containerTitleDate">
            <div
                className={`stuCouListcoursetopictext ${showSidebar ? 'move-right' : ''}`} 
            >
            Dashboard
            </div>
                <div 
                className={`stuCouListdatetext ${showSidebar ? 'move-right' : ''}`} 
            > 
            {formatDate(currentDate)}
            </div>
            </div>
              </div>
            <div
            className={`stuCouListcourseframewindow ${showSidebar ? 'shrink' : ''}`}   
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
