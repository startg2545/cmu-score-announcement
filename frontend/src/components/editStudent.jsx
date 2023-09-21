import React, { useState, useEffect } from "react";
import editStu from "./css/editStudent.module.css";
import { Table, TextInput, Modal, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import upStyle from "./css/uploadScore.module.css";
import { getListStudentScores, putStudentGrade } from "../services";
import { useForm } from "@mantine/form";

const EditStudent = () => {
  const [data, setData] = useState([]);
  const [point, setPoint] = useState(0);
  const [studentId, setStudentId] = useState(0);
  const [isOpeningForm, setIsOpeningForm] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [isScoreValid, setIsScoreValid] = useState(true);
  

  const columnNames = ["Number", "Student Number", "Note", "Management"];

  const editObj = JSON.parse(localStorage.getItem("Edit"));

  useEffect(() => {
    const showData = async () => {
      const resp = await getListStudentScores(editObj);
      console.log(resp);
      setData(resp);
    };
    if (!data.length) showData();
  }, [editObj, data]);

  const th = columnNames.map((element, key) => (
    <th key={key}>
      <center>{element}</center>
    </th>
  ));

  const handleClose = () => {
    close();
  };

  const scoreForm = useForm({
    initialValues: {
      score: "",
    },
    validate: {
      score: (value) => {
        if (!value) {
          setIsScoreValid(false);
          return "New score is required";
        }
        const isValid = /^\d+(\.\d+)?$/.test(value);
        setIsScoreValid(isValid);
        return isValid
          ? null
          : "Fill number only";
      },
    },
    // validateInputOnChange: true,
    validateInputOnBlur: true,
  });

  const td = data.map((element, key) => (
    <tr key={key}>
      {/* <td>
        <center>{key + 1}</center>
      </td> */}
      <td>
        <center>{element.studentId}</center>
      </td>
      <td>
        <center>
          {element.firstName} {element.lastName}
        </center>
      </td>
      <td>
        <center>{element.point}</center>
      </td>
      <td>
        <center>
          <div className={editStu.manageBtDisplay}>
            <div
              className={`${editStu.manageBT} ${editStu.editBT}`}
              onClick={() => {
                open();
                setIsOpeningForm(true);
                setStudentId(element.studentId);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 15 15"
                fill="none"
              >
                <path
                  d="M8.01788 9.36084L5.14737 9.87753L5.62579 6.96874L11.1085 1.5052C11.1974 1.41552 11.3032 1.34433 11.4198 1.29576C11.5364 1.24718 11.6615 1.22217 11.7878 1.22217C11.9141 1.22217 12.0392 1.24718 12.1558 1.29576C12.2724 1.34433 12.3782 1.41552 12.4672 1.5052L13.4814 2.51945C13.5711 2.6084 13.6423 2.71423 13.6909 2.83083C13.7395 2.94742 13.7645 3.07249 13.7645 3.1988C13.7645 3.32512 13.7395 3.45018 13.6909 3.56678C13.6423 3.68338 13.5711 3.78921 13.4814 3.87816L8.01788 9.36084Z"
                  stroke="white"
                  strokeWidth="1.55556"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.3236 9.83937V12.7099C12.3236 12.9637 12.2228 13.207 12.0434 13.3865C11.864 13.5659 11.6206 13.6667 11.3668 13.6667H2.27685C2.02308 13.6667 1.7797 13.5659 1.60026 13.3865C1.42082 13.207 1.32001 12.9637 1.32001 12.7099V3.61992C1.32001 3.36615 1.42082 3.12278 1.60026 2.94334C1.7797 2.7639 2.02308 2.66309 2.27685 2.66309H5.14736"
                  stroke="white"
                  strokeWidth="1.55556"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </center>
      </td>
    </tr>
  ));

  const handleSubmit = async (e) => {
    // e.preventDefault();
    setIsOpeningForm(false);
    console.log("This student's point has been updated to", point);
    let send_obj = {
      studentId: studentId,
      courseNo: editObj.courseNo,
      semester: editObj.semester,
      section: editObj.section,
      year: editObj.year,
      scoreName: editObj.scoreName,
      point: parseFloat(e),
    };
    console.log("send", send_obj);
    const resp = await putStudentGrade(send_obj);
    if (resp) console.log("receive", resp);
  };

  const editForm = () => {
    return (
      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        size="auto"
        display="flex"
        yOffset={0}
        xOffset={0}
        padding={0}
        radius={10}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <div className="flex flex-col">
          <div className="bg-primary py-1 flex justify-center text-2xl font-semibold text-white mb-3">
            <p className="text-white lg:text-2xl font-semibold text-center">
              Edit Score {studentId}?
            </p>
          </div>
          <div className={upStyle.ScoreSvgInline}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="65"
              height="66"
              viewBox="0 0 55 56"
              fill="none"
              transform="translate(14, 0)"
            >
              <rect width="55" height="56" fill="white" />
              <path
                d="M14.8959 27.9998C18.2387 27.9998 21.4447 29.3519 23.8084 31.7586C26.1721 34.1653 27.5001 37.4296 27.5001 40.8332C27.5001 44.2368 26.1721 47.501 23.8084 49.9077C21.4447 52.3144 18.2387 53.6665 14.8959 53.6665C11.5531 53.6665 8.34716 52.3144 5.98342 49.9077C3.61968 47.501 2.29175 44.2368 2.29175 40.8332C2.29175 37.4296 3.61968 34.1653 5.98342 31.7586C8.34716 29.3519 11.5531 27.9998 14.8959 27.9998ZM27.7957 4.6665C29.1624 4.66711 30.473 5.22018 31.4395 6.20417L37.8836 12.7608L44.3186 19.3222C45.2834 20.3068 45.8265 21.6415 45.8265 23.0322V46.0832C45.8265 47.4756 45.2833 48.8109 44.3163 49.7955C43.3493 50.78 42.0378 51.3332 40.6703 51.3332H25.6438C26.626 50.293 27.4571 49.1152 28.112 47.8355L40.6703 47.8332C41.1261 47.8332 41.5633 47.6488 41.8856 47.3206C42.208 46.9924 42.389 46.5473 42.389 46.0832L42.3867 23.3402H32.6563C31.3502 23.3404 30.0926 22.8358 29.1376 21.9285C28.1827 21.0211 27.6015 19.7786 27.5115 18.4518L27.5001 18.0925L27.4978 8.1665H14.323C13.8672 8.1665 13.43 8.35088 13.1077 8.67907C12.7853 9.00726 12.6042 9.45237 12.6042 9.9165V25.8462C11.4235 26.0318 10.2693 26.3624 9.16675 26.8308V9.9165C9.16675 8.52412 9.70999 7.18876 10.677 6.20419C11.644 5.21963 12.9555 4.6665 14.323 4.6665H27.7957ZM9.37987 34.9205L9.21946 35.0558L9.08883 35.2192C8.95678 35.414 8.88605 35.6451 8.88605 35.8818C8.88605 36.1186 8.95678 36.3497 9.08883 36.5445L9.22175 36.7078L13.278 40.8355L9.22633 44.9562L9.09571 45.1195C8.96365 45.3143 8.89293 45.5454 8.89293 45.7822C8.89293 46.0189 8.96365 46.25 9.09571 46.4448L9.22633 46.6082L9.38675 46.7412C9.5781 46.8756 9.80509 46.9476 10.0376 46.9476C10.2701 46.9476 10.4971 46.8756 10.6884 46.7412L10.8488 46.6082L14.8959 42.4852L18.9522 46.6128L19.1103 46.7482C19.3016 46.8826 19.5286 46.9546 19.7611 46.9546C19.9936 46.9546 20.2206 46.8826 20.412 46.7482L20.5724 46.6128L20.703 46.4495C20.8351 46.2547 20.9058 46.0236 20.9058 45.7868C20.9058 45.5501 20.8351 45.319 20.703 45.1242L20.5701 44.9608L16.5161 40.8355L20.577 36.7055L20.7099 36.5445C20.8424 36.3494 20.9134 36.1179 20.9134 35.8807C20.9134 35.6435 20.8424 35.4119 20.7099 35.2168L20.577 35.0558L20.4188 34.9205C20.2273 34.7855 19.9998 34.7132 19.7669 34.7132C19.5339 34.7132 19.3064 34.7855 19.1149 34.9205L18.9567 35.0558L14.8959 39.1858L10.8397 35.0558L10.6838 34.9205C10.4923 34.7855 10.2648 34.7132 10.0319 34.7132C9.79888 34.7132 9.57145 34.7855 9.37987 34.9205ZM30.9376 10.6398L30.9399 18.0948C30.9399 18.9815 31.5861 19.7118 32.4249 19.8285L32.6586 19.8448L39.9713 19.8425L30.9376 10.6398Z"
                fill="#696CA3"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="40"
              viewBox="0 0 44 40"
              fill="none"
              transform="translate(-10, 24)"
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
          <p className="text-black text-lg font-medium text-center mx-5 mt-3">
            Score of {studentId} in {editObj.scoreName} will be edited
          </p>
          <form onSubmit={scoreForm.onSubmit((data) => {
                      handleSubmit(data.score);
                    })} className="px-10 lg:px-24">
            <TextInput
              type="text"
              onChange={(e) => setPoint(e.target.value)}
              {...scoreForm.getInputProps("score")}
              placeholder="New Score"
              size="md"
              mt={12}
            />
            <div className="overflow-hidden">
              <div className="flex flex-row justify-evenly gap-3 text-black text-md md:text-lg lg:text-xl my-4 py-1">
                <Button
                  className={editStu.secondaryButton}
                  onClick={() => {
                    close();
                    scoreForm.reset();
                  }}
                  sx={{
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#F0EAEA",
                    },
                  }}
                  fw={500}
                >
                  Cancel
                </Button>
                <Button
                  className={editStu.primaryButton}
                  type="submit"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    );
  };

  return (
    <div className={editStu.editStudentFrameWindow}>
      <Table
        withColumnBorders
        verticalSpacing="sm"
        striped
        className={` ${editStu.sizeTa} ${editStu.font}`}
        fontSize={20.5}
      >
        <thead>
          <tr>
            <th
              className={`${editStu.col} ${editStu.front} ${editStu.eachCl}`}
              style={{ width: "300px" }}
            >
              <center>Student ID</center>
            </th>
            <th className={` ${editStu.col} ${editStu.eachCl}`}>
              <center>Name</center>
            </th>

            <th className={` ${editStu.col} ${editStu.eachCl}`}>
              <center>Point</center>
            </th>
            <th
              className={`${editStu.col} ${editStu.back} ${editStu.eachCl}`}
              style={{ width: "200px" }}
            >
              <center>Edit</center>
            </th>
          </tr>
        </thead>
        <tbody className={`${editStu.Stbody} ${editStu.child}`}>{td}</tbody>
      </Table>
      {isOpeningForm ? editForm() : null}
    </div>
  );
};

export default EditStudent;
