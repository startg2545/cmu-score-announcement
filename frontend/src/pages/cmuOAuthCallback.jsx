import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserInfoContext from "../context/userInfo";

export default function CMUOAuthCallback() {
  const { userInfo } = useContext(UserInfoContext);
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get("code");
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  async function signIn(authorizationCode) {
    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/cmuOAuth`,
        {},
        {
          params: {
            code: authorizationCode,
            redirect_uri: process.env.REACT_APP_CMU_OAUTH_REDIRECT_URL,
            client_id: process.env.REACT_APP_CMU_OAUTH_CLIENT_ID,
            client_secret: process.env.REACT_APP_CMU_OAUTH_CLIENT_SECRET,
            grant_type: "authorization_code",
          },
          withCredentials: true,
        }
      );

      return resp.data;
    } catch (err) {
      if (!err.response) {
        setMessage("Cannot connect to API Server. Please try again later.");
      } else if (!err.response.data.ok) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Unknown error occurred. Please try again later.");
      }
    }
  }

  const setUserInfo = async (data) => {
    userInfo.cmuAccount = data.cmuAccount;
    userInfo.firstName = data.firstName;
    userInfo.lastName = data.lastName;
    userInfo.studentId = data.studentId;
    userInfo.itAccountType = data.itAccountType;
  }

  useEffect(() => {
    if (!code) return;

    const fetchData = async () => {
      const resp = await signIn(code);
      if (resp) {
        await setUserInfo(resp);
        if (resp.itAccountType === "StdAcc") {
          navigate("/student-dashboard");
        } else if (resp.itAccountType === "MISEmpAcc") {
          navigate("/instructor-dashboard");
        } else {
          navigate("/sign-in");
        }
      }
    };

    fetchData();
  }, [code, navigate]);

  return (
    <div>
      <h3 style={{ color: "red" }}>{message || "Redirecting ..."}</h3>
      <button onClick={() => navigate('/sign-in')}>Go Back</button>
    </div>
  );
}
