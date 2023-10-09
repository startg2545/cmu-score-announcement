import axios from "axios";

export async function getCourseName(courseNo) {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/cpe/course`,
      {
        params: {
          courseNo: courseNo,
        },
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    if (!err.response)
      return "Cannot connect to API Server. Please try again later.";
    else if (!err.response.data.ok) return err.response.data;
    return "Unknown error occurred. Please try again later.";
  }
}

export async function getAllSections(req) {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/cpe/sections`,
      {
        params: {
          courseNo: req.courseNo,
          year: req.year,
          semester: req.semester,
        },
        timeout: 5000,
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    if (!err.response)
      return "Cannot connect to API Server. Please try again later.";
    else if (!err.response.data.ok) return err.response.data;
    return "Unknown error occurred. Please try again later.";
  }
}
