import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShowSidebarContext, CurrentContext } from "../context";
const { showSidebar } = useContext(ShowSidebarContext);
const { handleSidebarClick } = useContext(ShowSidebarContext);
const navigate = useNavigate();
// const [current, setCurrent] = useState([])
const [sidebar, setLgSidebar] = useState(false);
const handleLgSidebar = () => {
  setLgSidebar(!sidebar);
  handleSidebarClick(true);
};

const { current } = useContext(CurrentContext)

const navToSemesterYear = (semester, year) => {
  navigate({
    pathname: "/course",
    search: `?semester=${semester}&year=${year}`,
  });
};
const handleSemesterYear = (semester, year) => {
  setLgSidebar(!sidebar);
  handleSidebarClick(true);
  navToSemesterYear(semester, year);
};

export { handleLgSidebar, navToSemesterYear, handleSemesterYear, current };
