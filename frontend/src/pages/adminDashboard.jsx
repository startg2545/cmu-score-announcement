import React, { useState, useEffect, useContext } from "react";
import { TextInput, Button, Radio, Group, ScrollArea } from "@mantine/core";
import { addCurrent, getCurrent, deleteCurrent } from "../services";
import { CurrentContext, UserInfoContext } from "../context";
import { IoPersonAddOutline } from "react-icons/io5";
import { useForm } from "@mantine/form";

const AdminDashboard = () => {
  const { userInfo } = useContext(UserInfoContext);
  const { current, setCurrent } = useContext(CurrentContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  const submitForm = useForm({
    initialValues: {
      semester: "",
      year: "",
    },
    validate: {
      semester: (value) => {
        if (!value) {
          return "semester is required";
        }
      },
      year: (value) => {
        if (!value) {
          return "year is required";
        }

        const currentYear = new Date().getFullYear() + 543;
        const enteredYear = parseInt(value);
        if (isNaN(enteredYear)) {
          return "Invalid year for B.E. program";
        }
        // else if (enteredYear > currentYear || enteredYear < currentYear - 1) {
        //   return "Year must be the current year or less than 1 year.";
        // }
      },
    },
    validateInputOnBlur: true,
  });

  const handleSubmit = async (data) => {
    const resp_add = await addCurrent({
      semester: data.semester,
      year: data.year,
    });
    fetchData();
    submitForm.reset();
  };

  const fetchData = async () => {
    const resp = await getCurrent();
    setCurrent(resp);
  };

  useEffect(() => {
    const fetchData = async () => {
      const resp = await getCurrent();
      setCurrent(resp);
    };
    if (userInfo.itAccountType) fetchData();
  }, [setCurrent]);

  const handleDelete = async (_id) => {
    const resp = await deleteCurrent({
      _id: _id,
    });
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
      <label className="py-1" key={key}>
        <div
          className="bg-white drop-shadow border-black-50 border-[1px] xl:text-lg text-base  xl:mt-3 md:mt-0 mt-3
                      xl:w-[300px] lg:w-[240px] md:w-[250px] w-[230px] h-[50px] rounded-xl flex 
                      justify-between items-center px-10"
        >
          {element.semester}/{element.year}
          <button
            style={{ color: "red" }}
            onClick={() => handleDelete(element._id)}
            className="xl:px-4 "
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
          <div className="mx-[2%] lg:mt-3 max-h-screen ">
            <div className="lg:rounded-xl rounded-xl xl:h-[calc(89vh-60px)] lg:h-[calc(88vh-60px)] md:h-[calc(89vh-55px)]  h-[calc(88vh-50px)] overflow-hidden border-[3px] border-primary mt-24 ">
              <div className="flex flex-col ">
                <div className="bg-primary lg:py-2 py-2 lg:px-5 px-3 flex flex-row w-full items-center justify-between cursor-default ">
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
                <div
                  className="flex xl:flex-row flex-col  overflow-y-auto
                            p-5  gap-5 xl:justify-between 
                            xl:h-[calc(89vh-148px)] lg:h-[calc(88vh-148px)] md:h-[calc(89vh-140px)] h-[calc(88vh-130px)]"
                >
                  <div className="xl:flex xl:flex-col xl:gap-6 xl:w-4/6 ">
                    <form
                      onSubmit={submitForm.onSubmit((data) => {
                        handleSubmit(data);
                      })}
                      className="bg-white drop-shadow-lg border-black-70 border-[1px] rounded-xl
                               flex flex-col items-center py-5 gap-5 
                               xl:h-[250px] md:h-[180px] h-[360px]"
                    >
                      <p
                        className="xl:text-3xl lg:text-2xl md:text-xl font-semibold  text-xl
                                 xl:block lg:block md:block  text-primary"
                      >
                        Add new semester and year
                      </p>
                      <div className="flex md:flex-row flex-col justify-center xl:gap-10 lg:gap-20 md:gap-10 gap-2">
                        <Radio.Group
                          label="Semester"
                          withAsterisk
                          size="md"
                          className=" mb-3"
                          {...submitForm.getInputProps("semester")}
                        >
                          <Group mt="xs" mb="xs">
                            <Radio value="1" label="1" />
                            <Radio value="2" label="2" />
                            <Radio value="3" label="3(Summer)" />
                          </Group>
                        </Radio.Group>

                        <TextInput
                          size="md"
                          label="Academic Year"
                          {...submitForm.getInputProps("year")}
                          type="text"
                          withAsterisk={true}
                          placeholder="Add Year"
                        />
                        <Button
                          className=" bg-green-600 w-[100px] hover:bg-white hover:text-green-600 hover:border-green-600 md:mt-7 mt-5"
                          type="submit"
                        >
                          Confirm
                        </Button>
                      </div>
                    </form>
                    <div className="bg-white drop-shadow-xl border-black-70 border-[1px] rounded-xl h-4/6 items-center xl:block hidden"></div>
                  </div>
                  <div
                    className="bg-white drop-shadow-xl border-black-70 border-[1px] rounded-xl 
                                xl:w-2/5 w-full lg:max-h-[1200px] md:max-h-[1000px] max-h-[500px]
                                flex flex-col items-center py-5 
                                    "
                  >
                    <p
                      className="xl:text-3xl lg:text-2xl md:text-xl font-semibold text-xl 
                                    xl:block md:block text-primary mb-1"
                    >
                      Semester currently in active
                    </p>
                    <div
                      className="py-3  overflow-y-auto  border-[1px] border-black-50 mt-5 rounded-lg 
                                   flex xl:flex-col flex-col items-center lg:px-10 
                                   xl:h-5/6 h-5/6
                                   xl:w-5/6 lg:w-[920px] w-5/6 md:mx-10"
                    >
                      <div className="xl:hidden  hidden  md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-5 md:gap-4">
                        {showCurrent}
                      </div>
                      <div className="xl:block md:hidden block">
                        {showCurrent}
                      </div>
                    </div>
                  </div>
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
