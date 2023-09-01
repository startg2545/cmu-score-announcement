import { createContext } from "react";

const UserInfoContext = createContext({
  userInfo: {
    cmuAccount: null,
    firstName: null,
    lastName: null,
    studentId: null,
    itAccountType: null,
  },
  setUserInfo: () => {},
});

export default UserInfoContext;
