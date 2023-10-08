import axios from "axios";

export async function addCourse(data) {
  try {
    const resp = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/course/add`,
      data,
      {
        withCredentials: true
      }
    );
    return resp.data;
  } catch (err) {
    if (!err.response) {
      return "Cannot connect to API Server. Please try again later.";
    }
    return err.response.data;
  }
}

export async function addCoInstructors(data) {
  try {
    const resp = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/course`,
      data,
      {
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    if (!err.response) {
      return "Cannot connect to API Server. Please try again later.";
    }
    return err.response.data;
  }
}

export async function deleteCourseReally(data) {
  try {
    const resp = await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/course/`,
      {
        params: {
          courseNo: data.courseNo,
          year: data.year,
          semester: data.semester,
        },
        withCredentials: true
      }
    );
    return resp.data;
  } catch (err) {
    if (!err.response) {
      return "Cannot connect to API Server. Please try again later.";
    }
    return err.response.data;
  }
}
