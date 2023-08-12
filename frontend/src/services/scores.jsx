import axios from "axios";

export async function getScores() {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/scores`,
      {
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}
