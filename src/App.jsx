import React from "react";
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages';
import About from './pages/about';
import AddScore from './pages/addScore';
import SignUp from './pages/signup';
import Contact from './pages/contact';
import SearchCourse from './pages/searchCourse';
import StudentDashboard from './pages/studentDashboard';
import InstructorDashboard from './pages/instructorDashboard';
import CourseDetail from './pages/courseDetail';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/about' element={<About />} />
        <Route exact path='/contact' element={<Contact />} />
        <Route path='/course-detail' element={<CourseDetail />} />
        <Route path='/add-score' element={<AddScore />} />
        <Route exact path='/sign-up' element={<SignUp />} />
        <Route exact path='/search-course' element={<SearchCourse />} />
        <Route exact path='/student-dashboard' element={<StudentDashboard />} />
        <Route exact path='/instructor-dashboard' element={<InstructorDashboard />} />
      </Routes>
    </Router>
  )
}

export default App;