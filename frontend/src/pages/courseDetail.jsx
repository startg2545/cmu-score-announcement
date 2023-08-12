import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getScores } from '../services/course';


const CourseDetail = () => {
  const [scores, setScores] = useState([])

  const course_topic = scores.map((data,key) => {
    return (
      <div key={key}>
        <button>
          <label><b>Course ID: </b>{data.courseNo}, </label>
          <label><b>Section: </b>{data.section}, </label>
          <label><b>Semaster: </b>{data.semaster}, </label>
          <label><b>Year: </b>{data.year} </label>
        </button>
      </div>
    )
  })

  useEffect(()=>{

  }, [])
  const info = scores.map((data,key) => {
    return (
      <tr key={key}>
        <td>{scores.findIndex(x=>x.courseNo===data.courseNo)+1}</td>
        <td>{data['details'][0]['scoreName']}</td>
        <td>{data['details'][0]['studentNumber']}</td>
        <td>{data['details'][0]['fullScore']}</td>
        <td>{data['details'][0]['mean']}</td>
        <td><button>Eye</button></td>
        <td>
          <button>Add</button>
          <button>Edit</button>
          <button>Delete</button>
        </td>
      </tr>
    )
  })
  useEffect(()=>{
      const fetchData = async () => {
        const resp = await getScores();
        if (resp) {
          console.log(resp);
          setScores(resp)
        }
      };
  
      fetchData();
  }, [setScores])
  console.log(scores)
  return (
    <div>
    {course_topic}
    <table id='table'>
      <tbody>
      <tr>
        <th>Number</th>
        <th>Score Name</th>
        <th>Number of Students</th>
        <th>Full Score</th>
        <th>Mean</th>
        <th>Publish</th>
        <th>Management</th>
      </tr>
      {info}
      </tbody>
    </table>
    </div>
  )
}

export default CourseDetail;