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
        `${process.env.REACT_APP_API_BASE_URL}/cmuOAuth`,
        {},
        {
          params: {
            code: authorizationCode,
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
      setUserInfo(data);
    };

    const fetchData = async () => {
      const resp = await signIn(code);
      if (resp) {
        await setUser(resp);
        if (resp.itAccountType === "Admin") {
          navigate("/admin-dashboard");
        } else if (resp.itAccountType === "StdAcc") {
          navigate("/student-dashboard");
        } else if (resp.itAccountType === "MISEmpAcc") {
          navigate("/instructor-dashboard");
        } else {
          navigate("/");
        }
      }
    };

    fetchData();
  }, [code, navigate, setUserInfo]);

  return (
    <Flex m={50} justify="center" align="center" direction="column" gap={50}>
      <Title maw={500} order={1}>
        {message || "Redirecting ..."}
      </Title>
      {!userInfo.itAccountType && (
        <Button className="bg-blue-500" maw={125} onClick={() => navigate("/")}>
          Go Back
        </Button>
      )}
    </Flex>
  );
}
