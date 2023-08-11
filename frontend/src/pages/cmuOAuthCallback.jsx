import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CMUOAuthCallback() {
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

  useEffect(() => {
    if (!code) return;

    const fetchData = async () => {
      const resp = await signIn(code);
      if (resp) {
        if (resp.itaccounttype_id === "StdAcc") {
          navigate("/student-dashboard");
        } else if (resp.itaccounttype_id === "MISEmpAcc") {
          navigate("/instructor-dashboard");
        } else {
          navigate("/");
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
