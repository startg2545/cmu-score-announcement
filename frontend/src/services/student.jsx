import axios from "axios";

export async function addStudentGrade(data) {
  try {
    const resp = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/v1/student/add`,
      data,
      {
        timeout: 5000,
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response;
  }
}

export async function getStudentScores() {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/student`,
      {
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}
