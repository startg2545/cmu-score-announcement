import axios from "axios";

export async function getScores(year, semester) {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/scores`,
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

export async function getScoresCourse(data) {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/scores`,
      {
        params: {
          section: data.section,
          courseNo: data.courseNo,
          scoreName: data.scoreName,
        },
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}

export async function getListStudentScores(obj) {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/scores/students`,
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

export async function deleteScores(data) {
  try {
    const resp = await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/scores`,
      {
        params: {
          courseNo: data.courseNo,
          year: data.year,
          semester: data.semester,
          section: data.section,
          scoreName: data.scoreName,
          type: data.type,
        },
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}
