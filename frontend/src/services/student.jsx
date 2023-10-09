import axios from "axios";

export async function getStudentScores(year, semester) {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/student`,
      {
        params: {
          year: year,
          semester: semester,
        },
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}

export async function putStudentGrade(data) {
  try {
    const resp = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/student/update`,
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
      `${process.env.REACT_APP_API_BASE_URL}/student/add`,
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