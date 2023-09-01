import axios from "axios";

export async function getUserInfo() {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/user`,
      {
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response;
  }
}

export async function signOut() {
  const resp = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/api/v1/user/signOut`,
    {},
    {
      withCredentials: true,
    }
  )
  return resp.data;
}
