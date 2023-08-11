import React from "react";
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages';
import About from './pages/about';
import AddScore from './pages/addScore';
import SignIn from './pages/signIn';
import Contact from './pages/contact';
import SearchCourse from './pages/searchCourse';
import StudentDashboard from './pages/studentDashboard';
import InstructorDashboard from './pages/instructorDashboard';
import CourseDetail from './pages/courseDetail';
import CMUOAuthCallback from "./pages/cmuOAuthCallback";
import Course166 from './pages/course166';
import UploadScorePage from './pages/uploadScorePage';
import DropDown from './components/Navbar/DropDown/DropDown'

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/about' element={<About />} />
        <Route exact path='/contact' element={<Contact />} />
        <Route path='/course-detail' element={<CourseDetail />} />
        <Route path='/add-score' element={<AddScore />} />
        <Route exact path='/sign-in' element={<SignIn />} />
        <Route exact path='/cmuOAuthCallback' element={<CMUOAuthCallback />} />
        <Route exact path='/search-course' element={<SearchCourse />} />
        <Route exact path='/student-dashboard' element={<StudentDashboard />} />
        <Route exact path='/instructor-dashboard' element={<InstructorDashboard />} />
        <Route exact path='/course-166' element={<Course166 />} />
        <Route exact path='/upload-score-page' element={<UploadScorePage />} />
        <Route exact path='/dropdown' element={<DropDown />} />
      </Routes>
    </Router>
  )
}

export default App;