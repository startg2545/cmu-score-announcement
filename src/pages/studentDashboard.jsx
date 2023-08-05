import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCourse } from "../services/course";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState([]);
  const [token, setToken] = useState([]);
  const [jwtToken, setJwtToken] = useState([]);

  useEffect(() => {
    if (location.state == null) navigate("/sign-in");
    else {
      setUserInfo(location.state.userInfo);
      setToken(location.state.token);
      setJwtToken(location.state.jwt);
    }
  }, [location]);

  const [course, setCourse] = useState([]);

  console.log(jwtToken);
  console.log(userInfo);
  console.log(token);

  function signOut() {
    navigate("/sign-in");
  }

  async function sreachCourse() {
    const resp = await getCourse(jwtToken);
    setCourse(resp);
    console.log(resp);
  }

  return (
    <div className="p-3">
      <div>
        <h1>User Info</h1>
        <h3>cmuAccount : {userInfo.cmuitaccount}</h3>
        <h3>firstName : {userInfo.firstname_EN}</h3>
        <h3>lastName : {userInfo.lastname_EN}</h3>
        <h3>studentId : {userInfo.student_id}</h3>
        <h3>itAccountType : {userInfo.itaccounttype_id}</h3>
      </div>
      <button onClick={sreachCourse}>Check Api</button>
      <div>
        <h1>Course</h1>
        {course.map((item) => {
          return (
            <div key={item.courseNo}>
              {item.courseNo} : {item.courseNameEN}
            </div>
          );
        })}
      </div>
      <div>
        <h1>Token</h1>
        <h3>access_token : {token.access_token}</h3>
      </div>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default StudentDashboard;
