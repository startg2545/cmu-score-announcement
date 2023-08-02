import React from 'react';
import { useLocation } from 'react-router-dom';

const CourseDetail = () => {
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
  )
}

export default CourseDetail;