import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getScores } from '../services/course';

const CourseDetail = () => {
  const [scores, setScores] = useState([])
  const [details, setDetails] = useState([])
  const [key, setKey] = useState(0)

  useEffect(()=>{
    axios.get('course-detail')
    .then(res=>setScores(res.data))
    .catch(err=>console.log(err))
    // console.log(scores)
    console.log(details)
  }, [setScores, details])

  // useEffect(()=>{
  //     const fetchData = async () => {
  //       const resp = await getScores();
  //       if (resp) {
  //         console.log(resp);
  //         setScores(resp)
  //       }
  //     };
  //     fetchData();
  // }, [setScores])
  return (
    <div>
    {scores.map(function(data,key){
      return (
        <div key={key} >
        <button onClick={()=>setDetails(data.details)}>
          <label>Course Code: {data.courseNo}</label>
          <label>, Section: {data.section}</label>
          <label> ({data.semaster}/{data.year})</label>
        </button>
        </div>
      )
    })}
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
      {details.map(function(data,key){
        return (
          <tr key={key}>
            <td>{key+1}</td>
            <td>{data.scoreName}</td>
            <td>{data.studentNumber}</td>
            <td>{data.fullScore}</td>
            <td>{data.mean}</td>
            <td>[publish]</td>
            <td>[add][edit][delete]</td>
          </tr>
        )
      })}
      </tbody>
    </table>
    </div>
  )
}

export default CourseDetail;