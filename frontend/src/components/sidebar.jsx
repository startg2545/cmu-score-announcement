import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShowSidebarContext } from "../context";

const { showSidebar } = useContext(ShowSidebarContext);
const { handleSidebarClick } = useContext(ShowSidebarContext);
const navigate = useNavigate();
const [current, setCurrent] = useState([])
const [sidebar, setLgSidebar] = useState(false);
const handleLgSidebar = () => {
  setLgSidebar(!sidebar);
  handleSidebarClick(true);
};

useEffect(()=>{
  const fetchData = async () => {
    const resp = await getCurrent()
    const arr = []
    resp.map(e=>{
      let obj = {
        semester: e.semester,
        year: e.year
      }
      arr.push(obj)
    })
    console.log(arr)
    setCurrent(arr)
  }
  fetchData()
}, [])

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
