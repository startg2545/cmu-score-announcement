import { createContext } from "react";

const UserInfoContext = createContext({
  userInfo: {
    cmuAccount: "",
    firstName: "",
    lastName: "",
    studentId: "",
    itAccountType: "",
  },
});

export default UserInfoContext;
