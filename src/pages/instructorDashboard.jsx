import React from 'react';
import './instructorDashboard.css';
import cmulogo from '../image/cmulogo.png';
import sidebaricon from '../icon/sidebaricon.svg';

export default function Dashboard() {
  return (
    <>
    <div className='navbar'>
      <img src={sidebaricon} alt="SidebarIcon" className="sidebar-icon" />
      <img src={cmulogo} alt="CMULogo" className="cmulogo" />
      <p className="hellostyle">Hello, Dome P.</p>
      <p className="rolestyle">1/66, Instructor</p>
    </div>
    <div className='framewindow'></div>
    </>
  );
}
