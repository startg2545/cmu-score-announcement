import React from "react";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Table, Button, Modal } from "@mantine/core";
import { addStudentGrade, deleteScores } from "../services";
import tabStyle from "./css/tableScore.module.css";
import upStyle from "./css/uploadScore.module.css";

const TableScore = ({ data }) => {
  const [isPublished, setIsPublished] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [scoreName, setScoreName] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadComplete, setShowLoadComplete] = useState(false);
  const [message, setMessage] = useState();

  const handleClickDelete = () => {
    open();
  };

  const handleClose = () => {
    close();
  };

  const publicToggleStyle = {
    backgroundColor: isPublished ? "green" : "grey",
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

      const Q1 = (e.studentNumber + 1) / 4 - 1;
      const Q3 = (3 * (e.studentNumber + 1)) / 4 - 1;
      const baseQ1 = Math.floor(Q1);
      const baseQ3 = Math.floor(Q3);
      //calculate Upper Quartile Q3
      let temp = Number(sortPoint[baseQ3].point.toFixed(2));
      if (baseQ3 + 1 < sortPoint.length) {
        temp = (
          temp +
          (Q3 - baseQ3) *
            (sortPoint[baseQ3 + 1].point - sortPoint[baseQ3].point)
        ).toFixed(2);
      }
      data[i].UpperQu = temp;

      //calculate Lower Quartile Q1
      data[i].LowerQu = (
        sortPoint[baseQ1].point +
        (Q1 - baseQ1) * (sortPoint[baseQ1 + 1].point - sortPoint[baseQ1].point)
      ).toFixed(2);
    });
  };

  useEffect(() => {
    if (data.length) {
      console.log(data);
      data.map((e) => {
        setIsPublished((prev) => ({
          ...prev,
          [e.scoreName]: e.isPublish,
        }));
      });
      calStat();
    }
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
    setIsLoading(true);

    const resp = await addStudentGrade(student_schema);
    setMessage(resp);
    setIsLoading(false);
    setShowLoadComplete(true);
    setTimeout(() => {
      setShowLoadComplete(false);
    }, 1700);
    setIsPublished((prev) => ({
      ...prev,
      [el.scoreName]: true,
    }));
  };

  const unPublish = async (name) => {
    const scoreDelete = {
      courseNo: searchParams.get("courseNo"),
      year: parseInt(searchParams.get("year")),
      semester: parseInt(searchParams.get("semester")),
      section: parseInt(searchParams.get("section")),
      scoreName: name,
      type: "unpublish",
    };
    setIsLoading(true);

    const resp = await deleteScores(scoreDelete);
    setMessage(resp.message);
    setIsLoading(false);
    setShowLoadComplete(true);
    setTimeout(() => {
      setShowLoadComplete(false);
    }, 1500);
    setIsPublished((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const deleteOne = async (name) => {
    const scoreDelete = {
      courseNo: searchParams.get("courseNo"),
      year: parseInt(searchParams.get("year")),
      semester: parseInt(searchParams.get("semester")),
      section: parseInt(searchParams.get("section")),
      scoreName: name,
      type: "delete_one",
    };
    setIsLoading(true)

    const resp = await deleteScores(scoreDelete);
    setMessage(resp.message);
    setIsLoading(false);
    setShowLoadComplete(true);
    setTimeout(() => {
      setShowLoadComplete(false);
    }, 1500);
    
    localStorage.setItem("delete score", true);
  };

  const deleteAll = async (name) => {
    const scoreDelete = {
      courseNo: searchParams.get("courseNo"),
      year: parseInt(searchParams.get("year")),
      semester: parseInt(searchParams.get("semester")),
      scoreName: name,
      type: "delete_all",
    };
    setIsLoading(true)

    const resp =  await deleteScores(scoreDelete);
    setMessage(resp.message);
    setIsLoading(false);
    setShowLoadComplete(true);
    setTimeout(() => {
      setShowLoadComplete(false);
    }, 1500);
    
    localStorage.setItem("delete score", true);
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
      {/* <td>
        <center>{element.meanCou}</center>
      </td> */}
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
          <div
            key={element.scoreName}
            className={` ${tabStyle.publicBT} ${
              isPublished[element.scoreName] ? tabStyle.active : null
            }`}
            onClick={() =>
              !isPublished[element.scoreName]
                ? publish(element)
                : unPublish(element.scoreName)
            }
          >
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
            <div
              className={`${tabStyle.manageBT} ${tabStyle.editBT}`}
              onClick={() => {
                localStorage.setItem("Upload", true);
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
              <span className="text-white font-semibold lg:text-2xl text-md">Loading...</span>
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
        <div className='overflow-hidden lg:h-fit-content sm:w-[400px]'>
          <div className='bg-primary py-1 flex justify-center text-2xl font-semibold text-white mb-3'>
            <p className="text-white lg:text-2xl font-semibold text-center">
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
          <p className="text-black text-lg font-medium text-center mx-5 mt-3">"{scoreName}" will be deleted</p>
          <div className={tabStyle.ScorePopupButtons}>
            
            <Button
              className={tabStyle.secondaryButton}
              onClick={() => {
                handleClose();
                deleteOne(scoreName);
              }}
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
            <Button
              className={tabStyle.primaryButton}
              onClick={() => {
                handleClose();
                deleteAll(scoreName);
              }}
            >
              All sections
            </Button>
          </div>
          <div className={tabStyle.ScorePopupButtons2}>
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
            {/* <th className={` ${tabStyle.colSml} ${tabStyle.eachCl}`}>
              <center>
                Mean<br></br>Course
              </center>
            </th> */}
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
