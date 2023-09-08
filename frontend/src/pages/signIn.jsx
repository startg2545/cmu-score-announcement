import React from "react";
import './signIn.css';
import cmulogo2 from '../image/cmulogo2.png';
import emblem from '../image/emblemcmu.png';

const SignIn = () => {
  return (
    <div>
  
      <div className="popuplogin">
        <img src={cmulogo2} alt="CMULogo" className="logincmulogo" />
        <div className="topictext">SCORE ANNOUNCEMENT </div>
        <div className="logintext">ลงชื่อเข้าสู่ระบบ</div>
        <a href={process.env.REACT_APP_NEXT_PUBLIC_CMU_OAUTH_URL}>
          <div className="loginbutton"  style={{boxShadow: '2px 2px 2px 2px rgba(0, 0, 0, 0.15)'}}>
          <img src={emblem} alt="emblem" className="emblem"  />Login with CMU Account</div>
        </a>
      </div>

    </div>
  );
};

export default SignIn;
