import { createContext } from "react";

const CurrentContext = createContext({
  current: [],
  setCurrent: () => {}
});

export default CurrentContext;
