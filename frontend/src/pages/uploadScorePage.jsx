import React, { useState, useEffect } from 'react';
import './uploadScorePage.css';
import cmulogo from '../image/cmulogo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const UploadScorePage = ({ showSsSidebar, setShowSsSidebar }) => {
  const [isHovered, setIsHovered] = useState(false);

  const toggleSsSidebar = () => {
    setShowSsSidebar((prev) => !prev);
  };

  return (
    <div className='uploadScorenavbar'>
      <div
        className="uploadScoresidebar-icon"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={toggleSsSidebar}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 256 256">
          <g>
            {/* White background path for the border */}
            <path fill="#8084C8" d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Z"/>
            {/* Original path with the icon */}
            <path fill={isHovered ? 'black' : 'white'} d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Zm0 160H88V56h128v144Z"/>
          </g>
        </svg>
      </div>
      <img src={cmulogo} alt="CMULogo" className="uploadScorecmulogo" />
      <p className="uploadScorehellostyle">Hello, Dome P.</p>
      <p className="uploadScorerolestyle">1/66, Instructor</p>
    </div>
  );
};

export default function UploadScorePageContainer() {
    const [showSsSidebar, setShowSsSidebar] = useState(false);

    const handleSidebarClick = () => {
        setShowSsSidebar(!showSsSidebar);
      };
    const navigate = useNavigate();

    function signOut() {
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/v1/user/signOut`,
          {},
          {
            withCredentials: true,
          }
        )
        .finally(() => {
          navigate("/sign-in");
        });
      }
    
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
        <UploadScorePage showSsSidebar={showSsSidebar} setShowSsSidebar={setShowSsSidebar} />
        
          <div className={`uploadScoresssidebar ${showSsSidebar ? 'show' : ''}`}>
            <div className='uploadScoreframeCourseInSideBar'>
              <Link to="/course-166" className={`uploadScorecoursebutton ${showSsSidebar ? 'purple-button' : ''}`} onClick={handleSidebarClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" viewBox="0 0 11 16" fill="none">
                  <path d="M9.74365 8.83008L3.10303 15.4707C2.64404 15.9297 1.90186 15.9297 1.44775 15.4707L0.344238 14.3672C-0.114746 13.9082 -0.114746 13.166 0.344238 12.7119L5.05127 8.00488L0.344238 3.29785C-0.114746 2.83887 -0.114746 2.09668 0.344238 1.64258L1.44287 0.529297C1.90186 0.0703125 2.64404 0.0703125 3.09814 0.529297L9.73877 7.16992C10.2026 7.62891 10.2026 8.37109 9.74365 8.83008Z" fill="black"/>
                  </svg> Course 1/66 
              </Link>
              <div className='uploadScorecoursebutton'> 
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" viewBox="0 0 11 16" fill="none">
                <path d="M9.74365 8.83008L3.10303 15.4707C2.64404 15.9297 1.90186 15.9297 1.44775 15.4707L0.344238 14.3672C-0.114746 13.9082 -0.114746 13.166 0.344238 12.7119L5.05127 8.00488L0.344238 3.29785C-0.114746 2.83887 -0.114746 2.09668 0.344238 1.64258L1.44287 0.529297C1.90186 0.0703125 2.64404 0.0703125 3.09814 0.529297L9.73877 7.16992C10.2026 7.62891 10.2026 8.37109 9.74365 8.83008Z" fill="black"/>
                </svg> Course 3/65
              </div>
              <div className='uploadScorecoursebutton'> 
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" viewBox="0 0 11 16" fill="none">
                <path d="M9.74365 8.83008L3.10303 15.4707C2.64404 15.9297 1.90186 15.9297 1.44775 15.4707L0.344238 14.3672C-0.114746 13.9082 -0.114746 13.166 0.344238 12.7119L5.05127 8.00488L0.344238 3.29785C-0.114746 2.83887 -0.114746 2.09668 0.344238 1.64258L1.44287 0.529297C1.90186 0.0703125 2.64404 0.0703125 3.09814 0.529297L9.73877 7.16992C10.2026 7.62891 10.2026 8.37109 9.74365 8.83008Z" fill="black"/>
                </svg> Course 2/65
              </div>
              <div className='uploadScorecoursebutton'> 
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" viewBox="0 0 11 16" fill="none">
                <path d="M9.74365 8.83008L3.10303 15.4707C2.64404 15.9297 1.90186 15.9297 1.44775 15.4707L0.344238 14.3672C-0.114746 13.9082 -0.114746 13.166 0.344238 12.7119L5.05127 8.00488L0.344238 3.29785C-0.114746 2.83887 -0.114746 2.09668 0.344238 1.64258L1.44287 0.529297C1.90186 0.0703125 2.64404 0.0703125 3.09814 0.529297L9.73877 7.16992C10.2026 7.62891 10.2026 8.37109 9.74365 8.83008Z" fill="black"/>
                </svg> Course 1/65 
              </div>
              <div className='uploadScorecoursebutton'> 
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" viewBox="0 0 11 16" fill="none">
                <path d="M9.74365 8.83008L3.10303 15.4707C2.64404 15.9297 1.90186 15.9297 1.44775 15.4707L0.344238 14.3672C-0.114746 13.9082 -0.114746 13.166 0.344238 12.7119L5.05127 8.00488L0.344238 3.29785C-0.114746 2.83887 -0.114746 2.09668 0.344238 1.64258L1.44287 0.529297C1.90186 0.0703125 2.64404 0.0703125 3.09814 0.529297L9.73877 7.16992C10.2026 7.62891 10.2026 8.37109 9.74365 8.83008Z" fill="black"/>
                </svg> Course 3/64
              </div>
              <div className='uploadScorecoursebutton'> 
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" viewBox="0 0 11 16" fill="none">
                <path d="M9.74365 8.83008L3.10303 15.4707C2.64404 15.9297 1.90186 15.9297 1.44775 15.4707L0.344238 14.3672C-0.114746 13.9082 -0.114746 13.166 0.344238 12.7119L5.05127 8.00488L0.344238 3.29785C-0.114746 2.83887 -0.114746 2.09668 0.344238 1.64258L1.44287 0.529297C1.90186 0.0703125 2.64404 0.0703125 3.09814 0.529297L9.73877 7.16992C10.2026 7.62891 10.2026 8.37109 9.74365 8.83008Z" fill="black"/>
                </svg> Course 2/64 
              </div>
              <div className='uploadScorecoursebutton'> 
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" viewBox="0 0 11 16" fill="none">
                <path d="M9.74365 8.83008L3.10303 15.4707C2.64404 15.9297 1.90186 15.9297 1.44775 15.4707L0.344238 14.3672C-0.114746 13.9082 -0.114746 13.166 0.344238 12.7119L5.05127 8.00488L0.344238 3.29785C-0.114746 2.83887 -0.114746 2.09668 0.344238 1.64258L1.44287 0.529297C1.90186 0.0703125 2.64404 0.0703125 3.09814 0.529297L9.73877 7.16992C10.2026 7.62891 10.2026 8.37109 9.74365 8.83008Z" fill="black"/>
                </svg> Course 1/64
              </div>
            </div>
            <button onClick={signOut} className='uploadScorelogoutbutton'>  <svg  xmlns="http://www.w3.org/2000/svg" width="26" height="22" viewBox="0 0 29 25" fill="none">
                                            <path   d="M28.5986 13.6059L18.9315 24.5416C18.0684 25.518 16.5723 24.8345 16.5723 23.435V17.186H8.74647C7.98115 17.186 7.36544 16.4895 7.36544 15.6238V9.37483C7.36544 8.50909 7.98115 7.81259 8.74647 7.81259H16.5723V1.56362C16.5723 0.170627 18.0626 -0.519362 18.9315 0.457038L28.5986 11.3927C29.1338 12.0046 29.1338 12.994 28.5986 13.6059ZM11.0482 24.2161V21.6124C11.0482 21.1828 10.7374 20.8313 10.3577 20.8313H5.52408C4.50558 20.8313 3.68272 19.9004 3.68272 18.7483V6.25035C3.68272 5.09819 4.50558 4.16736 5.52408 4.16736H10.3577C10.7374 4.16736 11.0482 3.81585 11.0482 3.38624V0.782505C11.0482 0.352889 10.7374 0.00138444 10.3577 0.00138444H5.52408C2.47433 0.00138444 0 2.8004 0 6.25035V18.7483C0 22.1982 2.47433 24.9972 5.52408 24.9972H10.3577C10.7374 24.9972 11.0482 24.6457 11.0482 24.2161Z" 
                                            fill="white"/>
                                            </svg> Log out 
            </button>
            <div className='uploadScoreprofilebutton'> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 26 28" fill="none">
                                            <path d="M13 14C17.1031 14 20.4286 10.8664 20.4286 7C20.4286 3.13359 17.1031 0 13 0C8.89688 0 5.57143 3.13359 5.57143 7C5.57143 10.8664 8.89688 14 13 14ZM18.2 15.75H17.2308C15.9424 16.3078 14.5089 16.625 13 16.625C11.4911 16.625 10.0634 16.3078 8.7692 15.75H7.8C3.49375 15.75 0 19.0422 0 23.1V25.375C0 26.8242 1.24777 28 2.78571 28H23.2143C24.7522 28 26 26.8242 26 25.375V23.1C26 19.0422 22.5063 15.75 18.2 15.75Z" 
                                            fill="white"/>
                                            </svg> Profile
            </div>
          </div>
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