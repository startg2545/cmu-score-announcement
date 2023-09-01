import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { MantineProvider } from "@mantine/core";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = window.location.pathname;
  const notFetchUser = ["/sign-in", "/cmuOAuthCallback"];

  const handleSidebarClick = () => {
    setShowSidebar(!showSidebar);
  };

  const setUser = async (data) => {
    setUserInfo({
      cmuAccount: data.cmuAccount,
      firstName: data.firstName,
      lastName: data.lastName,
      studentId: data.studentId,
      itAccountType: data.itAccountType,
    });
  };

  useEffect(() => {
    console.log({...userInfo});
    const fetchData = async () => {
      if (!userInfo) {
        const resp = await getUserInfo();
        if (resp.ok) {
          setUser(resp.userInfo);
          setUserInfo(resp.userInfo);
        }
        else {
          window.location.replace("/sign-in");
        }
      }
    };

    if(!notFetchUser.includes(pathname)) {
      fetchData();
    }
  }, [userInfo, showSidebar, setUser]);

  return (
    <MantineProvider>
      <ShowSidebarContext.Provider
        value={{
          showSidebar: showSidebar,
          handleSidebarClick: handleSidebarClick,
        }}
>
        <UserInfoContext.Provider
          value={{
            userInfo: { ...userInfo },
            setUserInfo: setUserInfo,
          }}
      >
        <Router>
          <CMUNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
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
    </MantineProvider>
  );
}

export default App;
