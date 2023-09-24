import React, { useState, useEffect, useContext } from "react";
import { TextInput, Button } from "@mantine/core";
import { addCurrent, getCurrent, deleteCurrent } from "../services";
import { CurrentContext } from "../context";

const AdminDashboard = () => {
  const { current, setCurrent } = useContext(CurrentContext);
  const [semester, setSemester] = useState(0);
  const [year, setYear] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  function getCurrentBEYear() {
    const currentYear = new Date().getFullYear();
    return currentYear + 543; // Convert AD to BE
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resp_add = await addCurrent({
      semester,
      year,
    });
    console.log("send", resp_add);

    fetchData();

    document.getElementById("form").reset();
  };

  const fetchData = async () => {
    const resp = await getCurrent();
    setCurrent(resp);
  };

  const handleYearChange = (e) => {
    const inputYear = e.target.value;
    const regex = /^(25\d{2})$/;
    if (regex.test(inputYear)) {
      setYear(inputYear);
    }
  };

  

  useEffect(() => {
    const fetchData = async () => {
      const resp = await getCurrent();
      console.log(resp);
      setCurrent(resp);
    };
    fetchData();
  }, [setCurrent]);

  const handleDelete = async (_id) => {
    console.log("send", _id);
    const resp = await deleteCurrent({
      _id: _id,
    });
    console.log("receive", resp);

    fetchData();
  };

  const formatDate = (date) => {
    const buddhistYear = date.getFullYear() + 543;
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = date
      .toLocaleDateString("en-US", options)
      .replace(/\d{4}/, `${buddhistYear}`);

    return formattedDate;
  };

  const showCurrent = current?.map((element, key) => {
    return (
      <label className="py-4" key={key}>
        <div className="py-1 text-xl">
          {element.semester}/{element.year}
          <button
            style={{ color: "red" }}
            onClick={() => handleDelete(element._id)}
            className="px-4"
          >
            <b>Delete</b>
          </button>
        </div>
      </label>
    );
  });

  return (
    <>
      <div className="flex flex-row gap-3 justify-center ">
        <div className="flex w-full flex-col h-full">
          <div className="mx-[1%] lg:mt-3 max-h-screen ">
            <div className="lg:rounded-xl rounded-xl xl:h-[calc(84vh-60px)] lg:h-[calc(83vh-60px)] md:h-[calc(85vh-55px)]  h-[calc(85vh-50px)] overflow-hidden border-[3px] border-primary mt-24 ">
              <div className="flex flex-col ">
                <div className="bg-primary lg:py-2 py-2 lg:px-5 px-3 flex flex-row w-full items-center justify-between cursor-default mb-7">
                  <div className="flex items-start flex-col justify-center ">
                    <p className="text-white font-semibold xl:text-4xl lg:text-4xl md:text-3xl text-3xl">
                      {
                        <>
                          <p
                            className="xl:hidden lg:hidden md:hidden sm:hidden block 
                                             text-[29px]"
                          >
                            Admin Dashboard
                          </p>
                          <p
                            className="xl:text-4xl lg:text-4xl md:text-3xl  sm:text-3xl
                                  ˝         xl:block lg:block md:block sm:block hidden"
                          >
                            Admin Dashboard
                          </p>
                        </>
                      }
                    </p>

                    <p className="text-white font-semibold xl:text-xl lg:text-xl md:text-lg text-base">
                      {formatDate(currentDate)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col  px-5 xl:h-[calc(84vh-205px)] lg:h-[calc(83vh-197px)] md:h-[calc(85vh-207px)] h-[calc(85vh-193px)] overflow-y-auto">
                  <p
                    className="xl:text-4xl lg:text-4xl md:text-3xl font-semibold  text-2xl
                                  ˝         xl:block lg:block md:block  text-primary mb-3"
                  >
                    Semester currently in active
                  </p>
                  <div className="px-4 text-lg mb-5">{showCurrent}</div>
                  <form onSubmit={handleSubmit} id="form">
                    <p
                      className="xl:text-4xl lg:text-4xl md:text-3xl font-semibold  text-2xl
                                  ˝         xl:block lg:block md:block  text-primary mb-3"
                    >
                      Add new semester and year
                    </p>
                    <div className="px-4">
                      <p className="mb-2 text-lg">Semester</p>
                      <TextInput
                        type="text"
                        placeholder="Add Semester fill only 1, 2 and 3"
                        onChange={(e) => {
                          const input = e.target.value;
                          const sanitizedInput = input.replace(/[^1-3]/g, "");
                          setSemester(sanitizedInput);
                        }}
                        value={semester}
                        maxLength={1}
                        className="mb-5"
                      />
                    </div>
                    <div className="px-4">
                      <label className="mb-2 text-lg">Academic Year</label>
                      <TextInput
                        type="text"
                        placeholder="Add Year"
                        onChange={(e) => {
                          const inputYear = e.target.value;
                          const regex = /^(25\d{2})$/;
                          if (regex.test(inputYear)) {
                            setYear(inputYear);
                          }
                        }}
                        className="mb-5"
                      />
                    </div>
                    <div className="px-4">
                      <Button
                        type="submit"
                        style={{ backgroundColor: "Green" }}
                      >
                        Confirm
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
