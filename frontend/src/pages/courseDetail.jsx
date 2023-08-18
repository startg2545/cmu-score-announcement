import React, { useState, useEffect, useMemo } from 'react';
import { getScores } from '../services';
import { useSearchParams } from 'react-router-dom';

const CourseDetail = () => {
  const [details, setDetails] = useState([])
  const [searchParams, setSearchParams] = useSearchParams({});
  const [params, setParams] = useState({})

  const getParams = useMemo(() => {
    setParams({
      section: searchParams.get("section"),
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
    {/* {scores.map(function(score, i){
      return (
      <div key={i} >
        {score.sections.map(function(section, j){
        return (
        <div key={j}>
          <button onClick={()=>{
            setselected({
              section: section.section,
              instructor: section.instructor,
              coInstructor: section.coInstructor,
            })
            setDetails(section.details)
          }}>
            <label>Course Number: {score.courseNo}</label>
            <label>, Section: {section.section}</label>
            <label>, ({score.semester}/{score.year})</label>
          </button>
        </div>
        )
        })}
      </div>
      )
    })} */}
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