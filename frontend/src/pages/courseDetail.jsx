import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseDetail = () => {
  const [scores, setScores] = useState([])
  const info = scores.map((data,key) => {
    return (
      <tr key={key}>
        <td>{scores.findIndex(x=>x.courseNo===data.courseNo)+1}</td>
        <td>{data.scoreName}</td>
        <td>{data.studentNumber}</td>
        <td>{data.fullScore}</td>
        <td>{data.mean}</td>
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
    axios.get('http://localhost:3000/course-detail')
      .then(res=>setScores(res.data))
      .then(res=>console.log(res))
      .catch(err=>console.log(err))
  }, [setScores])
  console.log(scores)
  return (
    <table>
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
  )
}

export default CourseDetail;