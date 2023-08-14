import axios from "axios";
import React, { ReactDOM, useState, useEffect } from "react";

const academicYear = [
  {value: 4, text: 'Choose academic year'},
  {value: 2565, text: '2565'},
  {value: 2564, text: '2564'},
  {value: 2563, text: '2563'},
  {value: 2562, text: '2562'},
  {value: 2561, text: '2561'},
  {value: 2560, text: '2560'},
  {value: 2559, text: '2559'},
  {value: 2558, text: '2558'},
  {value: 2557, text: '2557'},
  {value: 2556, text: '2556'},
  {value: 2555, text: '2555'},
  {value: 2554, text: '2554'},
  {value: 2553, text: '2553'},
  {value: 2552, text: '2552'},
]
const semester = [
  {value: 0, text: 'Choose Semester'},
  {value: 1, text: 'Semester 1'},
  {value: 2, text: 'Semester 2'},
  {value: 3, text: 'Semester 3'}
]

export default function Api() {
  const [selectedYear, setSelectedYear] = useState(academicYear[0].value)
  const [selectedSemester, setSelectedSemester] = useState(semester[0].value)
  const [selectedSubject, setSelectedSubject] = useState('Choose Subject')
  const [subject, setSubject] = useState([])
  const [countSubmit, setCountSubmit] = useState(0)

  const handleChange = event => {
    if(event.target.value > 3){
      setSelectedYear(event.target.value);
      setCountSubmit(countSubmit+1)
    } else{
      setSelectedSemester(event.target.value);
      setCountSubmit(countSubmit+1)
    }
    if(event.target.value === 0 || event.target.value === 4){
      document.getElementById('chooseCourse').style.display = 'none'
      setCountSubmit(0)
    }

    if(countSubmit>0){
      callApi()
      document.getElementById('chooseCourse').style.display = 'block'
    }
  }

  const handleChangeCourse = event => {

      console.log(event.target.value)
  }

  async function callApi() {
    const accessToken = "2d63c18e-878d-487f-b7ae-53e42f5e1ce7";
    try {
      const response = await axios.get(
        "https://api.cpe.eng.cmu.ac.th/api/v1/course/detail",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      let course = response.data.courseDetails
      setSubject(course)
      console.log(course)
    } catch (error) {
      console.log(error.message);
      console.log(error.response.data);
    }
  }

  return (
    <div>
      <h1>Professor Dashboard</h1>
      <h2>Choose academic year</h2>
        <select value={selectedYear} onChange={handleChange} style={{ width: "160px" }}>
          {academicYear.map(year => (
            <option key={year.value} value={year.value}>
              {year.text}
            </option>
          ))}
        </select>

      <h2>Choose Semester</h2>
        <select value={selectedSemester} onChange={handleChange} style={{ width: "160px" }}>
          {semester.map(semester => (
            <option key={semester.value} value={semester.value}>
              {semester.text}
            </option>
          ))}
        </select>
      <div id="chooseCourse" value="chooseCourse" onChange={handleChangeCourse} style={{ display: 'none' }}>
        <h2>Choose Course</h2>
          <select value={subject} style={{ width: "160px" }}>
            {subject.map(subject => (
              <option key={subject.value} value={subject.value}>
                {subject.courseNameTH}
              </option>
            ))}
          </select>
          <button style={{ width: "160px" }}>Save course selection</button>
      </div>
    </div>
  )
}