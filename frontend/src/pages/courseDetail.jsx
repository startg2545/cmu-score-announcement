import React, { useState, useEffect, useMemo } from 'react';
import { getScores, addStudentGrade } from '../services';
import { useSearchParams } from 'react-router-dom';

const CourseDetail = () => {
  const [sections, setSections] = useState([])
  const [scores, setScores] = useState([])
  const [selectedSection, setSelectedSection] = useState()
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
      console.log(resp)
      if (resp) {
        resp.map(data=>{
          if (data.courseNo === params.courseNo) {
            let sections = data.sections
            setSections(sections)
            console.log(sections)
          };
        })
      }
    };
    fetchData();
  }, [params])

  const getAverage = (results) => {
    let avg = 0
    for (let x in results) {
      avg += results[x].point
    }
    return Math.round( avg * 100 ) / 100
  }

  const publish = async (score) => {
    console.log('before submit')
    let resp_student = await addStudentGrade(score)
    console.log('after submit')
    if (resp_student) {
      console.log('response: ', resp_student)
    }
  }

  return (
    <div>
      <label><b>Course No</b>: {params.courseNo}</label>
      {sections.map((section,index_section)=>{
          return (
            <div key={index_section}>
              <label onClick={()=>{
                setScores(section.scores) 
                setSelectedSection(index_section)
                }}
              ><button><b>Section</b>: {section.section}</button></label>
              { index_section === selectedSection ? 
              <table>
                <tbody>
                  <tr>
                    <th>Number</th>
                    <th>Score Name</th>
                    <th>Student Number</th>
                    <th>Full Score</th>
                    <th>Average Score</th>
                    <th>Publish</th>
                    <th>Management</th>
                  </tr>
                  {scores.map((score,index_score)=>{
                    return (
                      <tr key={index_score}>
                        <td>{index_score+1}</td>
                        <td>{score.scoreName}</td>
                        <td>{score.studentNumber}</td>
                        <td>{score.fullScore}</td>
                        <td>{getAverage(score.results)}</td>
                        <td><button onClick={()=>publish({
                          courseNo: params.courseNo,
                          year: params.year,
                          semester: params.semester,
                          score: score,
                        })}
                        >[open]</button></td>
                        <td>
                          <button>[add]</button>
                          <button>[edit]</button>
                          <button>[delete]</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table> : null }
            </div>
          )
      })}
    </div>
  )
}

export default CourseDetail;