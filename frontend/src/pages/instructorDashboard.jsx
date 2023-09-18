import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShowSidebarContext } from "../context";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "../services";
import { FaChevronRight } from "react-icons/fa";

const Dashboard = () => {
  const { showSidebar,  handleSidebarClick  } = useContext(ShowSidebarContext);
  const navigate = useNavigate();
  const [sidebar, setLgSidebar] = useState(false);

  //LgSidebar
  const handleLgSidebar = () => {
    setLgSidebar(!sidebar);
    handleSidebarClick(true);
  };
  //LgSidebar

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
  return (
    <div className="flex flex-row gap-3 justify-center">
      <div
        className={
          showSidebar
            ? "hidden lg:hidden pt-32 pb-8 duration-1000 transition-all delay-700 lg:pt-10 lg:left-0 justify-between -translate-x-[100%] shadow-gray-500 shadow-xl min-h-screen h-screen "
            : "hidden lg:flex-col lg:flex pt-32 pb-8 duration-1000 transition-all delay-700 lg:pt-10 lg:left-0 justify-between shadow-gray-500 shadow-xl min-h-screen h-screen "
        }
        //Large Only Sidebar
      >
        <div className="flex flex-col px-5 py-14">
          <ul className="flex flex-col gap-3 pt-5 pb-10 text-gray-800 justify-center text-center items-center font-semibold mx-3">
            {courseData.map((data, i) => (
              <li
                className="w-full flex flex-row cursor-pointer justify-center gap-2 text-2xl items-center hover:bg-[#D0CDFE] duration-300 px-5 py-2 rounded-xl "
                key={i}
                onClick={() => {
                  handleSemesterYear(data.semester, `25${data.year}`);
                }}
              >
                <FaChevronRight className="text-xl" />
                <span className="flex flex-row items-center">
                  <span className="mr-2">Course </span>
                  {data.semester}/{data.year}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="cursor-pointer px-5">
          <div
            onClick={() => signOut().finally(navigate("/sign-in"))}
            className="text-2xl font-bold hover:bg-red-500 shadow-md duration-200 text-center rounded-2xl mt-5 py-2 justify-center border-[3px] border-red-500 text-red-500 flex items-center gap-3 hover:cursor-pointer hover:text-white"
          >
            Log out
            <FaSignOutAlt />
          </div>
        </div>
      </div>
      <div className="p-5 mt-20 lg:mt-24 mx-3 lg:mr-5 w-full flex-col flex gap-3 border-[3px] border-primary rounded-2xl shadow-xl lg:h-[86vh] md:h-[86vh] h-[70vh] lg:overflow-visible overflow-x-auto">
        <div className="flex flex-col w-full h-full justify-center items-center">
          <div
            onClick={handleLgSidebar}
            className="rounded-xl border-2 border-primary text-maintext p-2 font-black cursor-pointer"
          >
            TEMPORARY Larger Only Sidebar Button
          </div>
          <p className="flex justify-center lg:text-3xl text-xl items-center text-center text-maintext font-semibold">
            {showSidebar
              ? "Please select an academic year"
              : "Click the icon at the top left corner"}
            <br />
            {showSidebar && "in the sidebar menu"}
            {!showSidebar && "to select an academic year"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
