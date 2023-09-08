import axios from "axios";

export async function addStudentGrade(data) {
  try {
    console.log(data);
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

export async function getStudentScores(studentId) {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/student`,
      {
        params: {
          studentId: studentId,
        },
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}
