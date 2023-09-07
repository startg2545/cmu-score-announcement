import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getUserInfo } from "./services";
import { ROLE, ShowSidebarContext, UserInfoContext } from "./context";
import Home from "./pages";
import About from "./pages/about";
import AddScore from "./pages/addScore";
import SignIn from "./pages/signIn";
import SearchCourse from "./pages/searchCourse";
import StudentDashboard from "./pages/studentDashboard";
import InstructorDashboard from "./pages/instructorDashboard";
import CourseDetail from "./pages/courseDetail";
import CMUOAuthCallback from "./pages/cmuOAuthCallback";
import Course166 from "./pages/course166";
import AddDatabase from "./pages/addDatabase";
import TableScore from "./components/TableScore";
import CMUNavbar from "./components/CMUNavbar";

import { MantineProvider } from "@mantine/core";
import ErrorView from "./pages/errorView";
import CourseDash from "./pages/courseDash";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = window.location.pathname;
  const notFetchUser = ["/sign-in", "/cmuOAuthCallback", "/errorView"];

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

  const getCurrentDimension = () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };
  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo) {
        const resp = await getUserInfo();
        if (resp.ok) {
          setUser(resp.userInfo);
          setUserInfo(resp.userInfo);
        } else {
          window.location.replace("/sign-in");
        }
      }
    };

    if (!notFetchUser.includes(pathname)) {
      fetchData();
    }

    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [userInfo, showSidebar, setUser]);

  useEffect(() => {
    if (
      userInfo &&
      userInfo.itAccountType === ROLE.INSTRUCTOR &&
      pathname !== "/errorView" &&
      ((screenSize.width < 1200 && screenSize.height < 900) ||
        (screenSize.width < 900 && screenSize.height < 1200))
    ) {
      // window.location.replace("/errorView");
    }
  }, [screenSize]);

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
              <Route exact path="/errorView" element={<ErrorView />} />
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
              <Route exact path="/table-score" element={<TableScore />} />

              <Route exact path="/courseDash" element={<CourseDash />} />
            </Routes>
          </Router>
        </UserInfoContext.Provider>
      </ShowSidebarContext.Provider>
    </MantineProvider>
  );
}

export default App;
