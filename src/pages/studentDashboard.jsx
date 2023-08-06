import axios from "axios";
import React, { useEffect, useState } from "react";
import cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { getCourse } from "../services/course";
import { getUserInfo } from "../services/userInfo";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const token = cookies.get("token");
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if(!token) navigate("/sign-in");
      const resp = await getUserInfo(token);
      setUserInfo(resp.userInfo);
    };

    fetchData();
  }, []);

  console.log(userInfo);

  const [course, setCourse] = useState([]);

  function signOut() {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/v1/user/signOut`)
      .finally(() => {
        cookies.remove("token");
        navigate("/sign-in");
      });
  }

  async function sreachCourse() {
    const resp = await getCourse(token);
    setCourse(resp);
    console.log(resp);
  }

  return (
    <div className="p-3">
      <div>
        <h1>User Info</h1>
        <h3>cmuAccount : {userInfo.cmuAccount}</h3>
        <h3>firstName : {userInfo.firstName}</h3>
        <h3>lastName : {userInfo.lastName}</h3>
        <h3>studentId : {userInfo.studentId}</h3>
        <h3>itAccountType : {userInfo.itAccountType}</h3>
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
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default StudentDashboard;
