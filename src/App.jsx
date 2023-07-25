import React from "react";
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom';
import Home from './pages';
import About from './pages/about';
import Grade from './pages/grade';
import SignUp from './pages/signup';
import Contact from './pages/contact';
import ScoreAnnouncement from './pages/scoreAnnouncement';
import StudentDashboard from './pages/studentDashboard';
import InstructorDashboard from './pages/instructorDashboard'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/about' element={<About />} />
        <Route exact path='/contact' element={<Contact />} />
        <Route path='grade' element={<Grade />} />
        <Route exact path='/sign-up' element={<SignUp />} />
        <Route exact path='/score-announcement' element={<ScoreAnnouncement />} />
        <Route exact path='/student-dashboard' element={<StudentDashboard />} />
        <Route exact path='/instructor-dashboard' element={<InstructorDashboard />} />
      </Routes>
    </Router>
  )
}

export default App;