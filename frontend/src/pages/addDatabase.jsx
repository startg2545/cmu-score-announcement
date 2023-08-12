import React from "react";
import axios from 'axios';
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addCourse } from "../services/course";

const AddDatabase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // const fetchData = async () => {
    //   const resp = await addCourse(location.state);
    //   if (resp) {
    //     console.log(resp);
    //     navigate('/course-detail');
    //   }
    // };
    // fetchData();
    axios.post('/course-detail', location.state, {
      timeout: 5000
    })
      .then((res)=>{console.log(res.data)})
      .then(()=>{navigate('/course-detail')})
      .catch((err)=>{console.log(err)})
  }, [location, navigate]);
  return (
    <div>
      <h1>Processing, don't close this window until it's finished.</h1>
    </div>
  );
};

export default AddDatabase;
