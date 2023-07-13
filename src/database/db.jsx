import axios from "axios";

export default function db() {
    async function callApi() {
        const accessToken = "2d63c18e-878d-487f-b7ae-53e42f5e1ce7";

        try {
          const response = await axios.get(
            "https://api.cpe.eng.cmu.ac.th/api/v1/course/detail",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          console.log(response.data);
        } catch (error) {
          console.log(error.message);
          console.log(error.response.data);
        }
      }
      callApi();
}