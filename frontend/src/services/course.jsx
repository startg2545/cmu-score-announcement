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
