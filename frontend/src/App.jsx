import React, { useContext, useEffect, useState, useCallback } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getUserInfo } from "./services";
import { ShowSidebarContext, UserInfoContext } from "./context";
import Home from "./pages";
import About from "./pages/about";
import AddScore from "./pages/addScore";
import SignIn from "./pages/signIn";
import Contact from "./pages/contact";
import SearchCourse from "./pages/searchCourse";
import StudentDashboard from "./pages/studentDashboard";
import InstructorDashboard from "./pages/instructorDashboard";
import CourseDetail from "./pages/courseDetail";
import CMUOAuthCallback from "./pages/cmuOAuthCallback";
import Course166 from "./pages/course166";
import AddDatabase from "./pages/addDatabase";
import TableScore from "./components/TableScore";
import CMUNavbar from "./components/CMUNavbar";
import StuCourseList from "./pages/stuCourseList";

function App() {
  const { userInfo } = useContext(UserInfoContext);
  const [userCT, setUserCT] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(Boolean);

  const handleSidebarClick = () => {
    setShowSidebar(!showSidebar);
  };
  
  const setUser = useCallback((data) => {
    userInfo.cmuAccount = data.cmuAccount;
    userInfo.firstName = data.firstName;
    userInfo.lastName = data.lastName;
    userInfo.studentId = data.studentId;
    userInfo.itAccountType = data.itAccountType;
  }, [userInfo])

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo.itAccountType === "") {
        const resp = await getUserInfo();
        if (resp.ok) {
          await setUser(resp.userInfo);
          setUserCT(resp.userInfo);
        }
      }
    };
    fetchData();
  }, [userCT, showSidebar, setIsLogin, setUser, userInfo.itAccountType]);

  return (
    <ShowSidebarContext.Provider
      value={{
        showSidebar: showSidebar,
        handleSidebarClick: handleSidebarClick,
      }}
    >
      <UserInfoContext.Provider
        value={{
          userInfo: { ...userCT },
        }}
      >
        <Router>
          <CMUNavbar />
          <Routes>
            <Route
              path="/"
              element={
                userInfo.itAccountType === "" ? (
                  <Navigate to="/sign-in" /> 
                ) : (
                  <Home />
                )
              }
            />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route exact path="/add-database" element={<AddDatabase />} />
            <Route path="/course-detail" element={<CourseDetail />} />
            <Route path="/add-score" element={<AddScore />} />
            <Route exact path="/sign-in" element={<SignIn />} />
            <Route
              exact
              path="/cmuOAuthCallback"
              element={<CMUOAuthCallback />}
            />
            <Route exact path="/search-course" element={<SearchCourse />} />
            <Route
              exact
              path="/student-dashboard"
              element={<StudentDashboard />}
            />
            <Route
              exact
              path="/instructor-dashboard"
              element={<InstructorDashboard />}
            />
            <Route path="/course" element={<Course166 />} />
            {/* <Route exact path="/upload-score-page" element={<UploadScorePage />} /> */}
            <Route exact path="/table-score" element={<TableScore />} />
            <Route exact path="/stuCourse-list" element={<StuCourseList />} />
          </Routes>
        </Router>
      </UserInfoContext.Provider>
    </ShowSidebarContext.Provider>
  );
}

export default App;
