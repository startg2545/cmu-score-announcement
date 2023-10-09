import axios from "axios";

export async function getUserInfo() {
  try {
    const resp = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/user`,
      {
        withCredentials: true,
      }
    );
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}

export async function signOut() {
  const resp = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/user/signOut`,
    {},
    {
      withCredentials: true,
    }
  )
  return resp.data;
}
