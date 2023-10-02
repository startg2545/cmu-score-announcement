import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StateContext, CurrentContext } from "../context";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "../services";
import { FaChevronRight } from "react-icons/fa";

const Dashboard = () => {
  const { current } = useContext(CurrentContext);
  const { showSidebar, handleSidebarClick } = useContext(StateContext);
  const [sidebar, setLgSidebar] = useState(false);

  const navigate = useNavigate();

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

  return (
    <div className="flex flex-row gap-3 justify-center">
      <div
        className={`hidden lg:flex lg:overflow-hidden lg:flex-col pt-32 pb-8 lg:pt-10 lg:left-0 justify-between shadow-gray-500 shadow-xl min-h-screen h-screen duration-500  ${
          showSidebar
            ? "transform translate-x-0 w-[300px]"
            : "transform -translate-x-full w-0"
        }`}
      >
        <div className="flex flex-col px-3 mt-14 overflow-y-auto">
          <ul className="flex flex-col gap-3 pt-2 pb-10 text-gray-800 justify-center text-center items-center font-semibold ">
            {current?.map((data, i) => (
              <li
                className="w-full flex flex-row cursor-pointer justify-center gap-2 text-lg items-center hover:bg-[#D0CDFE] duration-300 px-5 py-2 rounded-xl mr-3"
                key={i}
                onClick={() => {
                  handleSemesterYear(data.semester, data.year);
                }}
              >
                <FaChevronRight className="text-lg" />
                <div className="flex flex-row items-center">
                  <div className="mr-2">Course </div>
                  {data.semester}/{data.year.toString().slice(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="cursor-pointer px-5">
          <div
            onClick={() => signOut().finally(navigate("/sign-in"))}
            className="text-lg font-bold hover:bg-red-500 shadow-md duration-200 text-center rounded-3xl mt-5 py-1 justify-center border-[3px] border-red-500 text-red-500 flex items-center gap-3 hover:cursor-pointer hover:text-white"
          >
            Log out
            <FaSignOutAlt />
          </div>
        </div>
      </div>
      <div className="p-5 mt-20 lg:mt-24 mx-3 lg:mr-5 w-full flex-col flex gap-3 border-[3px] border-primary rounded-2xl shadow-xl lg:h-[86vh] md:h-[86vh] h-[70vh] lg:overflow-visible overflow-x-auto">
        <div className="flex flex-col w-full h-full justify-center items-center">
          <p className="flex justify-center lg:text-3xl text-xl items-center text-center text-maintext font-semibold">
            {showSidebar
              ? "Please select an academic year"
              : "Click icon at the top left corner"}
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
