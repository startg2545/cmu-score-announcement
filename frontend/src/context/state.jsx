import { createContext } from "react";

const StateContext = createContext({
  showSidebar: false,
  handleSidebarClick: () => {},
  isUploadScore: false,
  setUploadScore: () => {},
});

export default StateContext;
