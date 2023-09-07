import React, { useState, useEffect, useMemo } from 'react';
import { getScores } from '../services';
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

  return (
    <div>
      <label><b>Course No</b>: {params.courseNo}</label>
      {sections.map((data,index)=>{
          return (
            <div key={index}>
              <label onClick={()=>{
                setScores(data.scores) 
                setSelectedSection(index)
                }}
              ><button><b>Section</b>: {data.section}</button></label>
              { index == selectedSection ? 
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
                  {scores.map((data,index)=>{
                    return (
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td>{data.scoreName}</td>
                        <td>{data.studentNumber}</td>
                        <td>{data.fullScore}</td>
                        <td>{getAverage(data.results)}</td>
                        <td><button>[open]</button></td>
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