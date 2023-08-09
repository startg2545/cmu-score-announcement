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

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0]; // Get the selected file
    if (selectedFile) {
      // Perform actions with the selected file, e.g., reading its contents
      console.log('Selected file:', selectedFile);
    }
  };

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
          <div onClick={signOut} className='uploadScorelogoutbutton'>  <svg  xmlns="http://www.w3.org/2000/svg" width="26" height="22" viewBox="0 0 29 25" fill="none">
                                          <path   d="M28.5986 13.6059L18.9315 24.5416C18.0684 25.518 16.5723 24.8345 16.5723 23.435V17.186H8.74647C7.98115 17.186 7.36544 16.4895 7.36544 15.6238V9.37483C7.36544 8.50909 7.98115 7.81259 8.74647 7.81259H16.5723V1.56362C16.5723 0.170627 18.0626 -0.519362 18.9315 0.457038L28.5986 11.3927C29.1338 12.0046 29.1338 12.994 28.5986 13.6059ZM11.0482 24.2161V21.6124C11.0482 21.1828 10.7374 20.8313 10.3577 20.8313H5.52408C4.50558 20.8313 3.68272 19.9004 3.68272 18.7483V6.25035C3.68272 5.09819 4.50558 4.16736 5.52408 4.16736H10.3577C10.7374 4.16736 11.0482 3.81585 11.0482 3.38624V0.782505C11.0482 0.352889 10.7374 0.00138444 10.3577 0.00138444H5.52408C2.47433 0.00138444 0 2.8004 0 6.25035V18.7483C0 22.1982 2.47433 24.9972 5.52408 24.9972H10.3577C10.7374 24.9972 11.0482 24.6457 11.0482 24.2161Z" 
                                          fill="white"/>
                                          </svg> Log out 
          </div>
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
                  <filter id="filter0_i_261_1358" x="0" y="0" width="1451" height="6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
                  opacity="0.3125"
                  filter="url(#filter0_i_261_1358)"
                  />
              </svg>
          </div>
        <div className={`uploadScorecoursetopictext ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick}> Upload Score </div>
        <div className={`uploadScoredatetext ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick}> {formatDate(currentDate)}</div>
        <div className={`uploadScorecourseframewindow ${showSsSidebar ? 'shrink' : ''}`}>
          <div className="uploadScoreInlineContainer">
            <div className='uploadScoreText'>Assignment</div>
            <input type="text" className={`uploadScoreTextBox ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick} placeholder="Assignment Name"/>
          </div>
          <div className="uploadScoreInlineContainer">
            <div className='uploadScoreText'>Score File</div>
            <input type="file" className={`uploadScoreTextBox ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick} accept=".xlsx, .xls" onChange={handleFileUpload} style={{ transform: 'translateX(50px)'}}/>
          </div>
          <div className={`uploadScoreDescriptionBox ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick}>
            <p className='uploadScoreFileDescription'>
            Please click to open this Excel template file <span style={{ color: 'red', fontWeight: 'bold' }}>(support only this template .xlsx and .xls format)</span>  and fill student code, score (numbers only) and comments (if any).
            <span style={{ color: 'red', fontWeight: 'bold' }}> Do not change the column header name. </span>
            And attach back to this system.
            </p>
          </div>
          <div className="uploadScoreInlineContainer">
            <div className='uploadScoreText'>Note to student in section</div>
          </div>
          <input type="text" className="uploadScoreTextBox" placeholder="" style={{ transform: 'translateX(40px)', marginTop: '-24px', width: '70%', height: '60px' }} />
          <div className={`uploadScoreDescriptionBox ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick} style={{transform: 'translateY(30px)', marginLeft: '40px', backgroundColor:'#D0CDFE'}}>
            <p className='uploadScoreFileDescription'>
              The system <span style={{ fontWeight: 'bold' }}>automatically computes </span>  the statistical values, including the mean section, mean course, median, maximum value, SD, upper quartile, and lower quartile. Instructors have the option to publish these value to students or not after completing the upload.
            </p>
          </div>
          <div className={`uploadScoreDescriptionBox ${showSsSidebar ? 'move-right' : ''}`} onClick={handleSidebarClick} style={{transform: 'translateY(38px)', marginLeft: '40px', backgroundColor:'#A8F0F4', height: '20px' }}>
            <p className='uploadScoreFileDescription'>
            All changes to the file, including uploads, and edits, <span style={{ fontWeight: 'bold' }}> will be logged in the version history.  </span>
            </p>
          </div>
          <div className="uploadScoreInlineContainer">
            <div className='uploadScoreCancelButton'>
              <p className='uploadScoreCancelText'>CANCEL</p>
              <div className='uploadScoreCancelButtonInner'>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                  <path d="M5.09603 3.1778L10.5 8.5818L15.876 3.2058C15.9948 3.07941 16.1378 2.9783 16.2966 2.90853C16.4554 2.83877 16.6266 2.80178 16.8 2.7998C17.1713 2.7998 17.5274 2.9473 17.79 3.20986C18.0525 3.47241 18.2 3.8285 18.2 4.1998C18.2033 4.37145 18.1715 4.54195 18.1065 4.70084C18.0414 4.85973 17.9447 5.00366 17.822 5.1238L12.376 10.4998L17.822 15.9458C18.0528 16.1715 18.1881 16.4772 18.2 16.7998C18.2 17.1711 18.0525 17.5272 17.79 17.7898C17.5274 18.0523 17.1713 18.1998 16.8 18.1998C16.6216 18.2072 16.4436 18.1774 16.2773 18.1124C16.111 18.0473 15.96 17.9483 15.834 17.8218L10.5 12.4178L5.11003 17.8078C4.99174 17.93 4.85042 18.0275 4.69424 18.0948C4.53805 18.1621 4.37008 18.1978 4.20003 18.1998C3.82873 18.1998 3.47263 18.0523 3.21008 17.7898C2.94753 17.5272 2.80003 17.1711 2.80003 16.7998C2.79677 16.6282 2.82861 16.4577 2.89362 16.2988C2.95862 16.1399 3.0554 15.9959 3.17803 15.8758L8.62403 10.4998L3.17803 5.0538C2.94729 4.82807 2.81199 4.52238 2.80003 4.1998C2.80003 3.8285 2.94753 3.47241 3.21008 3.20986C3.47263 2.9473 3.82873 2.7998 4.20003 2.7998C4.53603 2.804 4.85803 2.9398 5.09603 3.1778Z" fill="white"/>
                </svg>
              </div>
            </div>
            <div className='uploadScoreConfirmButton'>
              <p className='uploadScoreConfirmText'>CONFIRM</p>
              <div className='uploadScoreConfirmButtonInner'> 
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="15" viewBox="0 0 21 15" fill="none">
                  <path d="M20.5189 0.434078C20.38 0.296534 20.2148 0.187361 20.0327 0.112859C19.8506 0.038357 19.6553 0 19.458 0C19.2608 0 19.0655 0.038357 18.8834 0.112859C18.7013 0.187361 18.536 0.296534 18.3971 0.434078L7.26494 11.3815L2.58793 6.7736C2.4437 6.63677 2.27344 6.52918 2.08688 6.45698C1.90031 6.38477 1.70109 6.34936 1.50059 6.35277C1.30009 6.35618 1.10224 6.39833 0.918332 6.47683C0.734422 6.55533 0.568056 6.66864 0.428734 6.81028C0.289412 6.95193 0.179863 7.11913 0.10634 7.30236C0.0328167 7.48558 -0.00324036 7.68123 0.000228499 7.87814C0.00369735 8.07505 0.0466239 8.26935 0.126557 8.44997C0.206489 8.63058 0.321863 8.79397 0.466091 8.93079L6.20402 14.5659C6.34293 14.7035 6.50819 14.8126 6.69028 14.8871C6.87237 14.9616 7.06768 15 7.26494 15C7.4622 15 7.6575 14.9616 7.83959 14.8871C8.02168 14.8126 8.18695 14.7035 8.32586 14.5659L20.5189 2.59128C20.6706 2.45386 20.7917 2.28708 20.8745 2.10144C20.9573 1.9158 21 1.71534 21 1.51268C21 1.31002 20.9573 1.10955 20.8745 0.923914C20.7917 0.738279 20.6706 0.571497 20.5189 0.434078Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
