import React from "react";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Center, Table, Button, Modal } from "@mantine/core";
import { addStudentGrade } from "../services";
import tabStyle from "./css/tableScore.module.css";
import Course from "../pages/css/course166.module.css";
import upStyle from "./css/uploadScore.module.css";

const TableScore = ({ data }) => {
  const [isPublic, setIsPublic] = useState(false);
  const [islog, setlog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [scoreName, setScoreName] = useState();

  const handleClickDelete = () => {
    open();
  };

  const handleClose = () => {
    close();
  };

  const calStat = () => {
    let total = 0;
    let meanS = 0;
    let sd = 0;

    data.map((e, i) => {
      //mean section
      e.results.map((e) => (total += e.point));
      meanS = total / e.studentNumber;
      data[i].meanSec = meanS.toFixed(2);
      total = 0;

      //calculate Median
      const sortPoint = e.results.sort((a, b) => a.point - b.point);
      const middle = (e.studentNumber + 1) / 2;
      let MD = 0;
      if (e.studentNumber % 2 === 0) {
        const lwMid = sortPoint[Math.floor(middle) - 1].point;
        const upMid = sortPoint[Math.ceil(middle) - 1].point;
        MD = (lwMid + upMid) / 2;
      } else {
        MD = data[i].Median = sortPoint[middle - 1].point;
      }
      data[i].Median = MD.toFixed(2);

      //calculate Max
      data[i].Max = sortPoint[e.studentNumber - 1].point;

      //calculate SD
      let x = 0;
      e.results.map((e) => (x += Math.pow(e.point - meanS, 2)));
      data[i].SD = Math.sqrt(x / e.studentNumber).toFixed(2);

      const Q1 = (e.studentNumber + 1) / 4;
      const Q3 = (3 * (e.studentNumber + 1)) / 4;
      const baseQ1 = Math.floor(Q1);
      const baseQ3 = Math.floor(Q3);
      //calculate Upper Quartile Q3
      data[i].UpperQu = (
        sortPoint[baseQ3 - 1].point +
        (Q3 - baseQ3) * (sortPoint[baseQ3].point - sortPoint[baseQ3 - 1].point)
      ).toFixed(2);
      //calculate Lower Quartile Q1
      data[i].LowerQu = (
        sortPoint[baseQ1 - 1].point +
        (Q1 - baseQ1) * (sortPoint[baseQ1].point - sortPoint[baseQ1 - 1].point)
      ).toFixed(2);
    });
  };

  useEffect(() => {
    calStat();
  }, [data]);

  const publish = async (el) => {
    const student_schema = {
      courseNo: searchParams.get("courseNo"),
      semester: searchParams.get("semester"),
      year: searchParams.get("year"),
      section: searchParams.get("section"),
      scoreName: el.scoreName,
      results: el.results,
      type: "publish_one",
    };

    console.log("send", student_schema);
    let resp_student = await addStudentGrade(student_schema);
    if (resp_student) console.log("response: ", resp_student);
  };

  const rows = data.map((element, key) => (
    <tr key={key}>
      <td>{element.scoreName}</td>
      <td>
        <center>{element.studentNumber}</center>
      </td>
      <td>
        <center>{element.fullScore}</center>
      </td>
      <td>
        <center>{element.meanSec}</center>
      </td>
      <td>
        <center>{element.meanCou}</center>
      </td>
      <td>
        <center>{element.Median}</center>
      </td>
      <td>
        <center>{element.Max}</center>
      </td>
      <td>
        <center>{element.SD}</center>
      </td>
      <td>
        <center>{element.UpperQu}</center>
      </td>
      <td>
        <center>{element.LowerQu}</center>
      </td>
      <td>
        <center>
          <div className={tabStyle.publicBT} onClick={() => publish(element)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M9.93649 12.2436C10.4208 12.2436 10.8853 12.0512 11.2278 11.7087C11.5702 11.3662 11.7626 10.9018 11.7626 10.4174C11.7626 9.93312 11.5702 9.46863 11.2278 9.12617C10.8853 8.7837 10.4208 8.59131 9.93649 8.59131C9.45218 8.59131 8.98769 8.7837 8.64523 9.12617C8.30276 9.46863 8.11037 9.93312 8.11037 10.4174C8.11037 10.9018 8.30276 11.3662 8.64523 11.7087C8.98769 12.0512 9.45218 12.2436 9.93649 12.2436Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.43729 10.0803C4.34305 7.35871 6.90997 5.39502 9.93708 5.39502C12.9624 5.39502 15.5281 7.35689 16.4351 10.076C16.5081 10.2963 16.5081 10.5337 16.4351 10.7535C15.5299 13.475 12.9624 15.4387 9.93586 15.4387C6.91058 15.4387 4.34426 13.4769 3.43789 10.7577C3.3647 10.5378 3.36409 10.3002 3.43729 10.0803ZM13.1322 10.4169C13.1322 11.2644 12.7955 12.0773 12.1962 12.6766C11.5969 13.2759 10.784 13.6126 9.93647 13.6126C9.08892 13.6126 8.27607 13.2759 7.67676 12.6766C7.07744 12.0773 6.74075 11.2644 6.74075 10.4169C6.74075 9.56931 7.07744 8.75647 7.67676 8.15715C8.27607 7.55784 9.08892 7.22115 9.93647 7.22115C10.784 7.22115 11.5969 7.55784 12.1962 8.15715C12.7955 8.75647 13.1322 9.56931 13.1322 10.4169Z"
                fill="white"
              />
            </svg>
          </div>
        </center>
      </td>
      <td>
        <center>
          <div className={tabStyle.manageBtDisplay}>
            <div className={`${tabStyle.manageBT} ${tabStyle.logBT}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M1.76447 7.78513C1.76447 9.08316 2.14938 10.352 2.87052 11.4313C3.59167 12.5106 4.61666 13.3518 5.81589 13.8485C7.01511 14.3452 8.3347 14.4752 9.60779 14.222C10.8809 13.9687 12.0503 13.3437 12.9681 12.4258C13.886 11.508 14.511 10.3386 14.7643 9.0655C15.0175 7.79241 14.8875 6.47282 14.3908 5.27359C13.8941 4.07437 13.0529 3.04938 11.9736 2.32823C10.8943 1.60708 9.62545 1.22217 8.32742 1.22217C6.44736 1.22009 4.63898 1.94344 3.27899 3.24154"
                  stroke="white"
                  strokeWidth="1.55556"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.78379 1.22217L3.27895 3.24154L5.29832 3.74638M8.32737 4.25123V8.28997L5.70219 9.60256"
                  stroke="white"
                  strokeWidth="1.55556"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={`${tabStyle.manageBT} ${tabStyle.editBT}`}>
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
            <div
              className={`${tabStyle.manageBT} ${tabStyle.deleteBT}`}
              onClick={() => {
                setScoreName(element.scoreName);
                handleClickDelete();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="20"
                viewBox="0 0 16 18"
                fill="none"
              >
                <path
                  d="M3 18C2.45 18 1.979 17.804 1.587 17.412C1.195 17.02 0.999333 16.5493 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.804 17.021 14.412 17.413C14.02 17.805 13.5493 18.0007 13 18H3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </center>
      </td>
    </tr>
  ));

  return (
    <div>
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
      >
        <div className={tabStyle["ScorePopup-Content"]}>
          <div className={tabStyle["ScorePopup-ContentInner"]}>
            <p style={{ color: "white", fontWeight: "600" }}>
              Delete {scoreName}?
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
          <p>"{scoreName}" will be permanently deleted</p>
          <div className={tabStyle.ScorePopupButtons}>
            <Button
              className={tabStyle.tertiaryButton}
              onClick={handleClose}
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
              className={tabStyle.secondaryButton}
              onClick={handleClose}
              sx={{
                color: "black",
                "&:hover": {
                  backgroundColor: "#8084c8",
                  color: "#ffffff",
                },
              }}
            >
              This section
            </Button>
            <Button className={tabStyle.primaryButton} onClick={handleClose}>
              All sections
            </Button>
          </div>
        </div>
      </Modal>
      {/* style={{border: "0px solid", transform: "translateX(0px)"}} */}
      <Table
        withColumnBorders
        verticalSpacing="md"
        striped
        className={` ${tabStyle.sizeTa} ${tabStyle.font}`}
        fontSize={18.5}
      >
        <thead>
          <tr>
            <th
              className={`${tabStyle.colBig} ${tabStyle.front} ${tabStyle.eachCl}`}
            >
              <center>Assignment</center>
            </th>
            <th className={` ${tabStyle.colSml} ${tabStyle.eachCl}`}>
              <center>Student</center>
            </th>
            <th className={` ${tabStyle.colSml} ${tabStyle.eachCl}`}>
              <center>Full Score</center>
            </th>
            <th className={` ${tabStyle.colSml} ${tabStyle.eachCl}`}>
              <center>
                Mean<br></br>Section
              </center>
            </th>
            <th className={` ${tabStyle.colSml} ${tabStyle.eachCl}`}>
              <center>
                Mean<br></br>Course
              </center>
            </th>
            <th className={` ${tabStyle.colSml} ${tabStyle.eachCl}`}>
              <center>Median</center>
            </th>
            <th className={` ${tabStyle.colSml} ${tabStyle.eachCl}`}>
              <center>Max</center>
            </th>
            <th className={` ${tabStyle.colSml} ${tabStyle.eachCl}`}>
              <center>SD</center>
            </th>
            <th className={` ${tabStyle.colSml} ${tabStyle.eachCl}`}>
              <center>
                Upper<br></br>Quartile
              </center>
            </th>
            <th className={` ${tabStyle.colSml} ${tabStyle.eachCl}`}>
              <center>
                Lower<br></br>Quartile
              </center>
            </th>
            <th className={` ${tabStyle.colSml} ${tabStyle.eachCl}`}>
              <center>Publish</center>
            </th>
            <th
              className={`${tabStyle.colBig} ${tabStyle.back} ${tabStyle.eachCl}`}
            >
              <center>Management</center>
            </th>
          </tr>
        </thead>
        <tbody className={`${tabStyle.Stbody} ${tabStyle.child}`}>{rows}</tbody>
      </Table>
    </div>
  );
};
export default TableScore;
