import axios from "axios";

export async function putStudentGrade(data) {
  try {
    const resp = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/v1/student/update`,
      data,
      {
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}

export async function addStudentGrade(data) {
  try {
    const resp = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/v1/student/add`,
      data,
      {
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}

export async function getStudentScores(obj) {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/student`,
      {
        params: {
          obj: obj
        },
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}
