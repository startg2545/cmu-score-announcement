import React, { useState, useEffect } from 'react';
import { getScores } from '../services';

const CourseDetail = () => {
  const [details, setDetails] = useState([])
  const [params, setParams] = useState({})
  
  useEffect(()=>{
    const fetchData = async () => {
      const resp = await getScores();
      if (resp) {
        resp.map(data=>{
          if (data.courseNo === params.courseNo && data.sections[0].section === params.section) {
            let section_detail = data.sections[0].details
            setDetails(section_detail)
          };
        })
      }
      console.log('courseNo', params.courseNo)
      console.log('section', params.section)
      console.log('year', params.year)
      console.log('semaster', params.semester)
    };
    fetchData();
  }, [params])
  return (
    <div>
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
      {details.map((data,key)=>{
        return (
          <tr key={key}>
            <td>{key+1}</td>
            <td>{data.scoreName}</td>
            <td>{data.studentNumber}</td>
            <td>{data.fullScore}</td>
            <td>{data.mean}</td>
            <td><button>[publish]</button></td>
            <td>
              <button>add</button>
              <button>edit</button>
              <button>delete</button>
            </td>
          </tr>
        )
      })}
      </tbody>
    </table>
    </div>
  )
}

export default CourseDetail;