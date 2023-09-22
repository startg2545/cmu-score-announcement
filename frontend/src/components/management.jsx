import React, { useState, useEffect, } from "react";
import { socket } from "../socket"
import { useSearchParams } from "react-router-dom";
import { addStudentGrade } from "../services";
import secMan from "./css/manage.module.css";
import TableScore from "./TableScore";
import Course from "../pages/css/course166.module.css";
import upStyle from "./css/uploadScore.module.css";
import tabStyle from "./css/tableScore.module.css";
import { Checkbox, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const Management = ({ data, courseName }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dataTable, setDataTable] = useState([]);
  const [countChecked, setCountChecked] = useState(0);
  const publishEach = useDisclosure();
  const publishAll = useDisclosure();
  const [checkedSections, setCheckedSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadComplete, setShowLoadComplete] = useState(false);
  const [message, setMessage] = useState();

  const showTable = (sec) => {
    setDataTable(data.filter((e) => e.section === parseInt(sec))[0].scores);
    searchParams.set("section", sec);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    socket.on("courseUpdate", (course) => {
      setDataTable([]);
    });
  }, []);

  useEffect(() => {
    if (data.length) {
      if (searchParams.get("section") && !dataTable.length) {
        showTable(searchParams.get("section"));
      }
    }
    data.sort((a, b) => a.section - b.section);
  }, [
    data,
    searchParams,
    dataTable,
  ]);

  const handleCheckboxChange = (e, value) => {
    if (e.target.checked === true) {
      setCountChecked(countChecked + 1);
    } else {
      setCountChecked(countChecked - 1);
    }
    const section = value.section;
    if (e.target.checked) {
      setCheckedSections([...checkedSections, section]);
    } else {
      setCheckedSections(checkedSections.filter((s) => s !== section));
    }
  };

  const submitPublishAll = async () => {
    const student_schema = {
      courseNo: searchParams.get("courseNo"),
      courseName: courseName,
      year: parseInt(searchParams.get("year")),
      semester: parseInt(searchParams.get("semester")),
      sections: data,
      type: "publish_many",
    };
    setIsLoading(true);

    let resp_student = await addStudentGrade(student_schema);
    setMessage(resp_student);
    setIsLoading(false);
    setShowLoadComplete(true);
    setTimeout(() => {
      setShowLoadComplete(false);
    }, 700);
    if (resp_student) console.log("response: ", resp_student);
  };

  const submitPublishEach = async () => {
    const section_arr = [];
    for (let checked in checkedSections) {
      data.map((e) => {
        if (e.section == checkedSections[checked]) section_arr.push(e);
      });
    }
    const student_schema = {
      courseNo: searchParams.get("courseNo"),
      courseName: courseName,
      year: searchParams.get("year"),
      semester: searchParams.get("semester"),
      sections: section_arr,
      type: "publish_many",
    };
    setIsLoading(true);

    let resp_student = await addStudentGrade(student_schema);
    setMessage(resp_student);
    setIsLoading(false);
    setShowLoadComplete(true);
    setTimeout(() => {
      setShowLoadComplete(false);
    }, 700);
    if (resp_student) console.log("response: ", resp_student);
  };

  return (
    <>
      <Modal
        opened={publishEach[0]}
        onClose={publishEach[1].close}
        centered
        withCloseButton={false}
        size="auto"
        display="flex"
        yOffset={0}
        xOffset={0}
        padding={0}
        radius={10}
        overlayProps={{
          opacity: 0.55,
          blur: 3,
        }}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <div className=" align-middle justify-center text-center">
          <div className="bg-primary py-1.5 flex justify-center text-2xl font-semibold text-white mb-3">
            <p className="text-white lg:text-2xl font-semibold text-center gap-2">
              Select section to publish
            </p>
          </div>
          <div>
            {data.map((value, key) => (
              <div key={key}>
                <Checkbox
                  color="indigo"
                  size="md"
                  onChange={(e) => handleCheckboxChange(e, value)}
                  id="selected-section"
                  name="selected-section"
                  style={{justifyContent: "center", display: 'flex', alignItems: 'center'}}
                />
                <p style={{ marginLeft: "40px", fontSize: "22px" }}>
                  Section{" "}
                  {value.section < 100
                    ? `00${value.section}`
                    : value.section < 10
                    ? `0${value.section}`
                    : value.section}
                </p>
              </div>
            ))}
          </div>
          <div className="overflow-hidden">
            <div className="flex flex-row justify-evenly gap-3 text-black text-md md:text-lg lg:text-xl my-4 py-1">
              <Button
                style={{ marginRight: "20px" }}
                className={Course.CancelPopupButton}
                onClick={() => {
                  publishEach[1].close();
                  setCheckedSections([]);
                }}
                radius="md"
                sx={{
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#F0EAEA",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                style={{ marginLeft: "20px" }}
                className={Course.AddPopupButton}
                type="submit"
                sx={{
                  "&:hover": {
                    backgroundColor: "#d499ff",
                  },
                }}
                onClick={() => {
                  publishEach[1].close();
                  setCheckedSections([]);
                  submitPublishEach();
                }}
                radius="md"
                disabled={countChecked === 0}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        opened={publishAll[0]}
        onClose={publishAll[1].close}
        centered
        withCloseButton={false}
        size="auto"
        display="flex"
        yOffset={0}
        xOffset={0}
        padding={0}
        radius={10}
        overlayProps={{
          opacity: 0.55,
          blur: 3,
        }}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <div className="overflow-hidden lg:h-fit-content sm:w-[400px]">
          <div className="bg-primary py-1.5 flex justify-center text-2xl font-semibold text-white mb-5">
            <p className="text-white lg:text-2xl font-medium align-middle items-center justify-center text-justify">
              Publish All Sections?
            </p>
          </div>
          <div className={upStyle.ScoreSvgInline}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="53"
              height="60"
              viewBox="0 0 63 76"
              fill="none"
              transform="translate(12, 0)"
            >
              <path
                d="M2 2H49.529L61 13.4545V74H2.00656L2 2ZM44.6129 2V18.3636H61M31.5033 64.1818V34.7273V64.1818ZM18.3936 44.5455L31.5033 31.4545L44.6129 44.5455"
                fill="url(#paint0_linear_299_1209)"
              />
              <path
                d="M44.6129 2V18.3636H61M31.5033 64.1818V34.7273M18.3936 44.5455L31.5033 31.4545L44.6129 44.5455M2 2H49.529L61 13.4545V74H2.00656L2 2Z"
                stroke="#160000"
                strokeWidth="3"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_299_1209"
                  x1="31.5"
                  y1="2"
                  x2="31.5"
                  y2="74"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    offset="0.359375"
                    stopColor="#777DDB"
                    stopOpacity="0.44"
                  />
                  <stop offset="1" stopColor="#5960D1" />
                </linearGradient>
              </defs>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="40"
              viewBox="0 0 44 40"
              fill="none"
              transform="translate(-4, 23)"
            >
              <path
                d="M26.622 3.17771L26.6221 3.17796L42.8112 31.6836C44.794 35.1767 42.2528 39.5 38.192 39.5H5.81084C1.74691 39.5 -0.793947 35.1765 1.18874 31.6836L17.3778 3.17796C19.4058 -0.392872 24.5971 -0.392349 26.622 3.17771ZM24.4033 33.7694C25.0417 33.1371 25.4013 32.2785 25.4013 31.3822C25.4013 30.4859 25.0417 29.6273 24.4033 28.995C23.7651 28.3629 22.9005 28.0086 22 28.0086C21.0994 28.0086 20.2348 28.3629 19.5966 28.995C18.9582 29.6273 18.5987 30.4859 18.5987 31.3822C18.5987 32.2785 18.9582 33.1371 19.5966 33.7694C20.2348 34.4015 21.0994 34.7558 22 34.7558C22.9005 34.7558 23.7651 34.4015 24.4033 33.7694ZM22 7.89368C21.0994 7.89368 20.2348 8.24795 19.5966 8.88008C18.9582 9.51237 18.5987 10.371 18.5987 11.2672V19.8879C18.5987 20.7842 18.9582 21.6428 19.5966 22.2751C20.2348 22.9072 21.0994 23.2615 22 23.2615C22.9005 23.2615 23.7651 22.9072 24.4033 22.2751C25.0417 21.6428 25.4013 20.7842 25.4013 19.8879V11.2672C25.4013 10.371 25.0417 9.51237 24.4033 8.88008C23.7651 8.24795 22.9005 7.89368 22 7.89368Z"
                fill="url(#paint0_linear_299_1210)"
                stroke="black"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_299_1210"
                  x1="22"
                  y1="0"
                  x2="22"
                  y2="40"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#F9E5C4" stopOpacity="0.76" />
                  <stop offset="1" stopColor="#FFBB0C" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="text-black text-lg font-medium text-center mx-5 mt-4">
            Scores in all sections will be published
          </p>
          <div className={tabStyle.ScorePopupButtons}>
            <Button
              style={{ marginRight: "20px" }}
              className={Course.CancelPopupButton}
              onClick={() => {
                publishAll[1].close();
              }}
              radius="md"
              sx={{
                color: "black",
                "&:hover": {
                  backgroundColor: "#F0EAEA",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              style={{ marginLeft: "20px" }}
              className={Course.AddPopupButton}
              type="submit"
              sx={{
                "&:hover": {
                  backgroundColor: "#d499ff",
                },
              }}
              onClick={() => {
                publishAll[1].close();
                submitPublishAll();
              }}
              radius="md"
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
      <div
        className={`overflow-auto  border-[2px] border-black
                      ${
                        searchParams.get("section")
                          ? "xl:h-[calc(84vh-150px)] lg:h-[calc(83vh-150px)] md:h-[calc(85vh-160px)] h-[calc(85vh-145px)]"
                          : "xl:h-[calc(84vh-205px)] lg:h-[calc(83vh-197px)] md:h-[calc(85vh-190px)] h-[calc(85vh-193px)]"
                      }
                      ${data.length === 0 && "overflow-hidden"}
                      `}
      >
        {!searchParams.get("section") && data.length !== 0 && (
          <div className="flex flex-col py-5 px-5 lg:px-14 gap-5 cursor-pointer ">
            {data.map((e, key) => (
              <p
                className="bg-gray-180 hover:bg-gray-200 active:bg-gray-300 shadow-lg lg:text-2xl px-5 py-4 rounded-xl text-black"
                key={key}
                onClick={() => {
                  showTable(e.section);
                }}
              >
                Section{" "}
                {e.section < 10
                  ? `00${e.section}`
                  : e.section < 100
                  ? `0${e.section}`
                  : e.section}
              </p>
            ))}
          </div>
        )}
        {data.length === 0 && !searchParams.get("section") && (
          <div className="flex flex-col justify-center text-center items-center overflow-hidden  xl:h-[calc(84vh-205px)] lg:h-[calc(83vh-197px)] md:h-[calc(85vh-207px)] h-[calc(85vh-193px)] ">
            <p className="xl:text-3xl lg:text-2xl md:text-xl text-lg text-maintext font-semibold ">
              No section
            </p>
            <span className="xl:text-2xl lg:text-xl md:text-lg text-base text-maintext opacity-60 ">
              Section will show when file is uploaded
            </span>
          </div>
        )}
        <div className="xl:m-5 lg:m-5 md:m-6 m-8 md:max-w-full lg:max-w-full max-w-32 ">
          {searchParams.get("section") && <TableScore data={dataTable} courseName={courseName}/>}
          {}
        </div>
      </div>
      {!searchParams.get("section") && (
        <div className="flex w-full justify-between gap-1 ">
          <button
            className={`w-full h-full  py-3
            ${
              data.length === 0
                ? "bg-gray-400 cursor-default"
                : "bg-primary hover:bg-maintext cursor-pointer"
            }`}
            disabled={data.length === 0 ? true : false}
            onClick={publishEach[1].open}
          >
            <p className="text-center lg:text-2xl text-white">
              Publish Each Section
            </p>
          </button>
          <button
            className={`w-full h-full  py-3
            ${
              data.length === 0
                ? "bg-gray-400 cursor-default"
                : "bg-primary hover:bg-maintext cursor-pointer"
            }`}
            disabled={data.length === 0 ? true : false}
            onClick={publishAll[1].open}
          >
            <p className="text-center lg:text-2xl text-white font-semibold ">
              Publish All Sections
            </p>
          </button>
        </div>
      )}
      <div>
        {(isLoading || showLoadComplete) && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75  z-50">
            {/* <div class="custom-box h-200 w-200 p-4 rounded-lg shadow-md inline-flex items-center bg-white "> */}
            {isLoading && (
              <div role="status" className="flex flex-col gap-5  items-center">
                <svg
                  aria-hidden="true"
                  class="inline w-20 h-20 mr-2  text-gray-200 animate-spin dark:text-white-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="white"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#8084c8"
                  />
                </svg>
                <span className="text-white font-semibold lg:text-2xl text-md">
                  Loading...
                </span>
              </div>
            )}
            {showLoadComplete && (
              <div class="flex flex-col gap-5 items-center">
                <svg
                  class="w-20 h-20 mr-2 text-green-500 dark:text-green-400 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <span className="text-white font-semibold lg:text-2xl text-md">
                  {message}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* {data.length === 0 && (
        <div className="bg-green-400">
          <div className="bg-red-400">
            <p className="bg-sky-400" style={{ fontWeight: "600" }}>
              Publish Each Section
            </p>
          </div>
          <div className="bg-emerald-400">
            <p className="bg-yellow-400">Publish All Sections</p>
          </div>
        </div>
      )} */}
    </>
  );
};

export default Management;
