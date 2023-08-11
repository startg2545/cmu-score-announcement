import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate} from 'react-router-dom';

const AddDatabase = () => {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(()=>{
        axios.post('/course-detail', location.state, {
            timeout: 5000
        })
            .then((res)=>{console.log(res.data)})
            .then(()=>{navigate('/course-detail')})
            .catch((err)=>{console.log(err)})
    }, [location, navigate])
    return (
    <div>
      <h1>Processing, don't close this window until it's finished.</h1>
    </div>
  )
}

export default AddDatabase
