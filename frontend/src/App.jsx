import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { getUserInfo, getCurrent, socket } from "./services";
import { ROLE, ShowSidebarContext, UserInfoContext, CurrentContext } from "./context";
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
  const [current, setCurrent] = useState([])
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

  const fetchCurrent = async () => {
    const resp = await getCurrent();
    setCurrent(resp)
  }

  useEffect(() => {
    socket.on("currentUpdate", (newCurrent) => {
      fetchCurrent();
    });
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo) {
        const resp = await getUserInfo();
        if (resp) {
          setUser({ ...resp });
          setUserInfo({ ...resp });
        } else {
          window.location.replace("/sign-in");
        }
      }
    };

    if (!notFetchUser.includes(pathname)) {
      fetchData();
    }

    if (!current.length) fetchCurrent()

  }, [userInfo, showSidebar, setUser, current]);

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
        <CurrentContext.Provider
          value={{
            current: current,
            setCurrent: setCurrent,
          }}
        >
          <Router>
            <CMUNavbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route exact path="/sign-in" element={<SignIn />} />
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
      </ShowSidebarContext.Provider>
    </MantineProvider>
  );
}

export default App;
