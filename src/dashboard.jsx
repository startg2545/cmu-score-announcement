import './dashboard.css';

import cmulogo from './image/cmulogo.png';
import axios from "axios";


export default function Dashboard() {
  async function callApi() {
    //For example only, you shouldn't hard code token!
    const accessToken = "2d63c18e-878d-487f-b7ae-53e42f5e1ce7";

    try {
      const response = await axios.get(
        "https://api.cpe.eng.cmu.ac.th/api/v1/course/detail",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
      console.log(error.response.data);
    }
  }
  callApi();
  return (
    <div className='framenavbar'>
      <div className="navbar">
        <img className="cmulogo" src={cmulogo} alt="CMU Logo" />
        <div className='innernavbar'>
          {/* Inner Navbar Content */}
        </div>
        <div className='frameprofile'></div>
        <div className='framelogout'></div>
      </div>
    </div>
  );
}
