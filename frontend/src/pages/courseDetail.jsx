import React, { useState, useEffect, useMemo } from 'react';
import { getScores } from '../services';
import { useSearchParams } from 'react-router-dom';

const CourseDetail = () => {
  const [scores, setScores] = useState([])
  const [searchParams, setSearchParams] = useSearchParams({});
  const [params, setParams] = useState({})

  const getParams = useMemo(() => {
    setParams({
      semester: searchParams.get("semester"),
      year: searchParams.get("year"),
      courseNo: searchParams.get("courseNo"),
    })
  }, [searchParams])
  useEffect(()=>{
    const fetchData = async () => {
      const resp = await getScores();
      if (resp) {
        resp.map(data=>{
          if (data.courseNo === params.courseNo) {
            let scores = data.sections
            setScores(scores)
          };
        })
      }
      console.log('courseNo', params.courseNo)
      console.log('year', params.year)
      console.log('semaster', params.semester)
    };
    fetchData();
  }, [params])
  return (
    <div>
    {/* <table id='table'>
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
      {scores.map((data,key)=>{
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
    </table> */}
    </div>
  )
}

export default CourseDetail;