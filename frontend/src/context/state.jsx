import { createContext } from "react";

const StateContext = createContext({
  showSidebar: false,
  handleSidebarClick: () => {},
  isUploadScore: false,
  setIsUploadScore: () => {},
});

export default StateContext;
