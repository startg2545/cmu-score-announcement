import React, { createContext } from "react";

const ShowSidebarContext = createContext({
  showSidebar: false,
  handleSidebarClick: () => {},
});

export default ShowSidebarContext;
