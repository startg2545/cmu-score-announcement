import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserInfoContext } from "../context";
import { Title, Button, Flex } from "@mantine/core";

export default function CMUOAuthCallback() {
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
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

    const setUser = async (data) => {
      setUserInfo({
        cmuAccount: data.cmuAccount,
        firstName: data.firstName,
        lastName: data.lastName,
        studentId: data.studentId,
        itAccountType: data.itAccountType,
      });
    };

    const fetchData = async () => {
      const resp = await signIn(code);
      if (resp) {
        await setUser(resp);
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
  }, [code, navigate, setUserInfo]);

  return (
    <Flex m={50} justify="center" align="center" direction="column" gap={50}>
      <Title maw={500} order={1}>{message || "Redirecting ..."}</Title>
      {!userInfo.itAccountType && <Button maw={125} onClick={() => navigate("/sign-in")}>
        Go Back
      </Button>}
    </Flex>
  );
}
