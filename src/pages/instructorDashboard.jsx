import React, { useState } from 'react';
import './instructorDashboard.css';
import cmulogo from '../image/cmulogo.png';
import sidebaricon from '../icon/sidebaricon.svg';

const Component = ({ showSsSidebar, setShowSsSidebar }) => {
  const [isHovered, setIsHovered] = useState(false);
  const iconColor = isHovered ? 'black' : 'white';

  const changeIconColor = (hoverState) => {
    setIsHovered(hoverState);
  };

  const toggleSsSidebar = () => {
    setShowSsSidebar((prev) => !prev);
  };

  return (
    <div className='navbar'>
      <div
        className="sidebar-icon"
        onMouseEnter={() => changeIconColor(true)}
        onMouseLeave={() => changeIconColor(false)}
        onClick={toggleSsSidebar}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 256 256">
          <g>
            {/* White background path for the border */}
            <path fill="#8084C8" d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Z"/>
            {/* Original path with the icon */}
            <path fill={iconColor} d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Zm0 160H88V56h128v144Z"/>
          </g>
        </svg>
      </div>
      <img src={cmulogo} alt="CMULogo" className="cmulogo" />
      <p className="hellostyle">Hello, Dome P.</p>
      <p className="rolestyle">1/66, Instructor</p>
    </div>
  );
};

export default function Dashboard() {
  const [showSsSidebar, setShowSsSidebar] = useState(false);

  return (
    <>
      <Component showSsSidebar={showSsSidebar} setShowSsSidebar={setShowSsSidebar} />
      <div className="framewindow-container">
        {/* Conditionally render the sssidebar */}
        <div className={`sssidebar ${showSsSidebar ? 'show' : ''}`}></div>
        <div className={`framewindow ${showSsSidebar ? 'shrink' : ''}`}>
          <p className='startstyle'>
            {showSsSidebar ? 'Please select academic year' : 'Click icon at the top left corner'}
            <br />
            {showSsSidebar && 'in the sidebar menu'}
            {!showSsSidebar && 'to select academic year'}
          </p>
        </div>
      </div>
    </>
  );
}


