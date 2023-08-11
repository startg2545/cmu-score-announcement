import React, { useState, useEffect } from 'react';
import './uploadScorePage.css';
import SideBar from '../components/SideBar';
import CMUNavbar from '../components/Navbar';

export default function UploadScorePageContainer() {
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
    
  
    return (
      <>
        <CMUNavbar showSidebar={showSsSidebar} setShowSidebar={setShowSsSidebar} />
        <SideBar showSidebar={showSsSidebar} setShowSidebar={setShowSsSidebar} />
          <div className={`uploadScoreTextNavigate ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick}> Course 1/66 &nbsp; {'>'} &nbsp; 261497 &nbsp; {'>'} &nbsp; Upload Score </div>
          <div className={`uploadScoreLine ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick}>
                <svg width="120%" height="9">
                    <defs>
                    <filter id="filter0_i_261_1358" x="0" y="0" width="1351" height="6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="4"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_261_1358"/>
                    </filter>
                    </defs>
                    <line
                    x1="2%"
                    y1="50%"
                    x2="90%"
                    y2="50%"
                    stroke="#8084C8"
                    stroke-width="2"
                    opacity="0.9025"
                    filter="url(#filter0_i_261_1358)"
                    />
                </svg>
            </div>
          <div className={`uploadScorecoursetopictext ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick}> Upload Score </div>
          <div className={`uploadScoredatetext ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick}> {formatDate(currentDate)}</div>
          <div className={`uploadScorecourseframewindow ${showSsSidebar ? 'shrink' : ''}`}>
            
          

      </div>
    </>
  );
}
