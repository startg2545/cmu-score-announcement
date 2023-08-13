import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShowSidebarContext from "./context/showSidebarContex";
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
import UploadScorePage from "./pages/uploadScorePage";
import AddDatabase from "./pages/addDatabase";
import DropDown from "./components/DropDown";
import TableScore from "./components/TableScore";
import CMUNavbar from "./components/CMUNavbar";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const handleSidebarClick = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <ShowSidebarContext.Provider
      value={
        {showSidebar: showSidebar,
        handleSidebarClick: handleSidebarClick}
      }
    >
      <Router>
        <CMUNavbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/add-database" element={<AddDatabase />} />
          <Route path="/course-detail" element={<CourseDetail />} />
          <Route path="/add-score" element={<AddScore />} />
          <Route exact path="/sign-in" element={<SignIn />} />
          <Route exact path="/cmuOAuthCallback" element={<CMUOAuthCallback />} />
          <Route exact path="/search-course" element={<SearchCourse />} />
          <Route exact path="/student-dashboard" element={<StudentDashboard />} />
          <Route exact path="/instructor-dashboard" element={<InstructorDashboard />} />
          <Route exact path="/course-166" element={<Course166 />} />
          <Route exact path="/upload-score-page" element={<UploadScorePage />} />
          <Route exact path="/dropdown" element={<DropDown />} />
          <Route exact path="/table-score" element={<TableScore />} />
        </Routes>
      </Router>
    </ShowSidebarContext.Provider>
  );
}

export default App;
