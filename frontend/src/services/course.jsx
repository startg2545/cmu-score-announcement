import axios from "axios";

export async function getCourse() {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/course/detail`,
      {
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}
