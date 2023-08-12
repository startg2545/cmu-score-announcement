import axios from "axios";

export async function getCourse(signal) {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/course`,
      {
        signal: signal,
        withCredentials: true,
      }
    );
    console.log(resp);
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}

export async function addCourse(data) {
  try {
    console.log(data);
    const resp = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/v1/course/add`,
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

export async function getScores() {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/course/scores`,
      {
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}
