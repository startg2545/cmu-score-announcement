import React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addCourse } from "../services/course";

const AddDatabase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const resp = await addCourse(location.state);
      if (resp) {
        console.log(resp);
        navigate('/course-detail');
      }
    };
    fetchData();
  }, [location, navigate]);
  return (
    <div>
      <h1>Processing, don't close this window until it's finished.</h1>
    </div>
  );
};

export default AddDatabase;
