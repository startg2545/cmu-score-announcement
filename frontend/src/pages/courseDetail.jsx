import React from 'react';
import { useLocation } from 'react-router-dom';

const CourseDetail = () => {
<<<<<<< HEAD
  const location = useLocation();
  console.log(location.state);
  return (
    <div>
      <h1>This page is course detail</h1>
      <ul>
        <li> <b>Course Detail: </b>{location.state['courseNo']} </li>
        <li> <b>Section: </b>{location.state['section']} </li>
        <li> <b>Year: </b>{location.state['year']} </li>
        <li> <b>Semaster: </b>{location.state['semaster']} </li>
        <li> <b>Score Name: </b>{location.state['scoreName']} </li>
        <li> <b>Student Number: </b>{location.state['studentNumber']} </li>
        <li> <b>Full Score: </b>{location.state['fullScore']} </li>
        <li> <b>Mean: </b>{location.state['mean']} </li>
      </ul>
    </div>
=======
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
>>>>>>> 17876f0bcc103bb0da569a8660a983654e39c5cd
  )
}

export default CourseDetail;