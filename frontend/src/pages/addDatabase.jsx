import React, { useEffect } from 'react'
import { json, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const AddDatabase = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const data = location.state
    console.log(data)
    
    // const queryObj = { name: 'JIRO'}
    useEffect(()=>{
      makePostRequest('http://localhost:3000/course-detail', data)
    }, [])

    function makePostRequest(path, queryObj) {
      axios.post(path, queryObj).then(
          (response) => {
              let result = response.data;
              console.log(result);
          },
          (error) => {
              console.log(error);
          }
      ).then(
        () => {
          navigate('/course-detail')
        }
      )
  }

  return (
    <div>
      <h2>Processing, don't close this window until it's finished loading.</h2>
    </div>
  )
}

export default AddDatabase
