import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShowSidebarContext } from "../context";

const { showSidebar } = useContext(ShowSidebarContext);
const { handleSidebarClick } = useContext(ShowSidebarContext);
const navigate = useNavigate();
const [sidebar, setLgSidebar] = useState(false);
const handleLgSidebar = () => {
  setLgSidebar(!sidebar);
  handleSidebarClick(true);
};
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

const courseData = [
  { semester: 1, year: 66 },
  { semester: 3, year: 65 },
  { semester: 2, year: 65 },
  { semester: 1, year: 65 },
];
export { handleLgSidebar, navToSemesterYear, handleSemesterYear, courseData };
