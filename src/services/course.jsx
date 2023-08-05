import axios, { AxiosError } from "axios";

export async function getCourse(authorizationCode) {
  try {
      const resp = await
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/api/v1/course/detail`,
          {
            headers: { Authorization: "Bearer " + authorizationCode },
          }
        );
        console.log(resp.data.courseDetails);
      return resp.data.courseDetails;
  } catch (err) {
    return err;
  }
}
