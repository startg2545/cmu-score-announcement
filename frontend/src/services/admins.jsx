import axios from "axios";

export async function getAdminUser() {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/admins/user`,
      {
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}

export async function addAdmin(data) {
  try {
    const resp = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/admins/user`,
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

export async function deleteAdmin(_id) {
  try {
    const resp = await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/admins/user`,
      {
        params: {
          _id: _id,
        },
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}

export async function deleteCurrent(data) {
  try {
    const resp = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/admins/delete`,
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

export async function addCurrent(data) {
  try {
    const resp = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/admins`,
      data,
      {
        timeout: 5000,
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}

export async function getCurrent() {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/admins`,
      {
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}
