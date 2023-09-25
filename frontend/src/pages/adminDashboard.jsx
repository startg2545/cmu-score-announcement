import React, { useState, useEffect, useContext } from "react";
import { TextInput, Button, Radio, Group, Select } from "@mantine/core";
import { addCurrent, getCurrent, deleteCurrent } from "../services";
import { CurrentContext, UserInfoContext } from "../context";
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
        else if (enteredYear > currentYear || enteredYear < currentYear - 1)
        {
          return "Year must be the current year or less than 1 year."
        }
      },
    },
    validateInputOnBlur: true,
  });
  

  const handleSubmit = async (data) => {
    const resp_add = await addCurrent({
      semester: data.semester,
      year: data.year
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
                  <form onSubmit={submitForm.onSubmit((data) => {handleSubmit(data)})}>
                    <p
                      className="xl:text-4xl lg:text-4xl md:text-3xl font-semibold  text-2xl
                                  ˝         xl:block lg:block md:block  text-primary mb-3"
                    >
                      Add new semester and year
                    </p>
                    <div className="px-4">
                      <Radio.Group
                        label="Semester"
                        withAsterisk
                        size="md"
                        className=" mb-3"
                        {...submitForm.getInputProps("semester")}
                      >
                        <Group mt="xs">
                          <Radio value="1" label="1" />
                          <Radio value="2" label="2" />
                          <Radio value="3" label="3(Summer)" />
                        </Group>
                      </Radio.Group>
                      {/* <TextInput
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
                      /> */}
                    </div>
                    <div className="px-4">
                      <TextInput
                        size="md"
                        label="Academic Year"
                        {...submitForm.getInputProps("year")}
                        type="text"
                        withAsterisk={true}
                        placeholder="Add Year"
                        className="mb-5"
                      />
                    </div>
                    <div className="px-4">
                      <Button
                        type="submit"
                        style={{ backgroundColor: "Green", marginTop: "20px" }}
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
