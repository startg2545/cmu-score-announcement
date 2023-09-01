import React, { useEffect, useState } from "react";
import './signIn.css';

const ErrorView = () => {

    const getCurrentDimension = () => {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }

    const [screenSize, setScreenSize] = useState(getCurrentDimension());
    useEffect(() => {
        const updateDimension = () => {
            setScreenSize(getCurrentDimension())
          }
          window.addEventListener('resize', updateDimension);
          
          
      
          return(() => {
              window.removeEventListener('resize', updateDimension);
          })
    }, [] )

    useEffect (() => {
        console.log(screenSize);
        if(screenSize.width >= 900 || screenSize.height >= 1200 || screenSize.width >= 1200 || screenSize.height >= 900)
          {
            window.location.replace("/sign-in");
          }
    },[screenSize]);

  return (

    <div>
        <div className="popuplogin">
        
        <div className="topictext">SCORE ANNOUNCEMENT </div>
        <div className="logintext">ลงชื่อเข้าสู่ระบบ</div>
      </div>
    </div>
  );
};

export default ErrorView;
