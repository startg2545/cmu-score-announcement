import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { getUserInfo, getCurrent, socket } from "./services";
import { ROLE, StateContext, UserInfoContext, CurrentContext } from "./context";
import { CMUNavbar, TableScore } from "./components";
import Home from "./pages";
import SignIn from "./pages/signIn";
import StudentDashboard from "./pages/studentDashboard";
import InstructorDashboard from "./pages/instructorDashboard";
import AdminDashboard from "./pages/adminDashboard";
import CourseDetail from "./pages/courseDetail";
import CMUOAuthCallback from "./pages/cmuOAuthCallback";
import Course166 from "./pages/course166";
import EditStudent from "./components/editStudent";

function App() {
  const [current, setCurrent] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isUploadScore, setUploadScore] = useState(false);
  const pathname = window.location.pathname;
  const notFetchUser = ["/", "/cmuOAuthCallback"];
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);

  const handleSidebarClick = () => {
    setShowSidebar(!showSidebar);
  };

  const setUser = async (data) => {
    setUserInfo(data);
    setLoadingUserInfo(false);
  };

  const fetchData = async () => {
    if (!userInfo) {
      setLoadingUserInfo(true);
      const resp = await getUserInfo();
      if (resp.ok) {
        setUser({ ...resp.user });
      } else {
        window.location.replace("/");
      }
    }
  };

  const fetchCurrent = async () => {
    const resp = await getCurrent();
    setCurrent(resp);
  };

  useEffect(() => {
    socket.on("currentUpdate", (newCurrent) => {
      fetchCurrent();
    });
  }, []);

  useEffect(() => {
    if (!notFetchUser.includes(pathname)) {
      fetchData();
      if (!current.length && userInfo) fetchCurrent();
    }
  }, [pathname, userInfo, showSidebar, setUser, current]);

  if (loadingUserInfo) {
    return;
  }

  return (
    <MantineProvider>
      <StateContext.Provider
        value={{
          showSidebar: showSidebar,
          handleSidebarClick: handleSidebarClick,
          isUploadScore: isUploadScore,
          setUploadScore: setUploadScore,
        }}
      >
        <UserInfoContext.Provider
          value={{
            userInfo: { ...userInfo },
            setUserInfo: setUserInfo,
          }}
        >
          <CurrentContext.Provider
            value={{
              current: current,
              setCurrent: setCurrent,
            }}
          >
            <Router>
              <CMUNavbar />
              <Routes>
                <Route exact path="/" element={<SignIn />} />
                <Route
                  exact
                  path="/cmuOAuthCallback"
                  element={<CMUOAuthCallback />}
                />
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
                <Route
                  exact
                  path="/admin-dashboard"
                  element={<AdminDashboard />}
                />
                <Route path="/course" element={<Course166 />} />
                <Route exact path="/table-score" element={<TableScore />} />
                <Route path="/course-detail" element={<CourseDetail />} />
                <Route path="/edit-student" element={<EditStudent />} />
              </Routes>
            </Router>
          </CurrentContext.Provider>
        </UserInfoContext.Provider>
      </StateContext.Provider>
    </MantineProvider>
  );
}

export default App;
