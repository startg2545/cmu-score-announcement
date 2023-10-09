import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { getStudentScores, getScoresCourse, socket } from "../services";
import { HiChevronRight } from "react-icons/hi";
import { VscGraph } from "react-icons/vsc";
import { ImParagraphLeft } from "react-icons/im";
import { Text, Progress } from "@mantine/core";
import { Chart } from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";
import { CurrentContext } from "../context";

Chart.register(annotationPlugin);

export default function StudentDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { current } = useContext(CurrentContext);
  const [message, setMessage] = useState();
  const [courseList, setCourseList] = useState([]);
  const [section, setSection] = useState();
  const [scoreList, setScoreList] = useState([]);
  const [scores, setScores] = useState();
  const [searchParams, setSearchParams] = useSearchParams({});
  const [isShowGraph, setIsShowGraph] = useState(false);
  const title = [
    "YOUR SCORE",
    "Mean",
    "Max",
    "Median",
    "Lower Quartile",
    "Upper Quartile",
  ];
  const colorProgress = [
    "#0014c7",
    "red",
    "#429195",
    "brown",
    "green",
    "purple",
  ];
  let mean = 0,
    max = 0,
    median = 0,
    q1 = 0,
    q3 = 0,
    num = 0;
  const [stat, setStat] = useState([]);
  const [SD, setSD] = useState(0);
  const [fullScore, setFullScore] = useState();
  const [xValues, setXValues] = useState([]);
  const [yValues, setYValues] = useState([]);

  const fetchData = async () => {
    if (current.length) {
      const year = current[0].year;
      const semester = current[0].semester;
      const data = await getStudentScores(year, semester);
      if (data) {
        if (data.ok) {
          setCourseList(data.courseGrades);
        } else {
          setMessage(data.message);
        }
      }
    }
  };

  useEffect(() => {
    setCourseList([]);
    setScoreList([]);
    setStat([]);
    setMessage();
    fetchData();
  }, [current]);

  useEffect(() => {
    socket.on("courseUpdate", (course) => {
      setCourseList([]);
      setScoreList([]);
      setStat([]);
      setMessage();
      fetchData();
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    if (!courseList.length && !message) fetchData();
    if (searchParams.get("courseNo") && courseList.length) {
      setCourse(searchParams.get("courseNo"));
    }
    if (searchParams.get("scoreName")) {
      calStat(searchParams.get("scoreName"));
    }

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [courseList, section, scores]);

  useEffect(() => {
    if (!searchParams.get("scoreName")) {
      setScores(null);
    }
  }, [searchParams]);

  useEffect(() => {
    const densityNormal = (value, mean, sd) => {
      const SQRT2PI = Math.sqrt(2 * Math.PI);
      sd = sd == null ? 1 : sd;
      const z = (value - (mean || 0)) / sd;
      return Math.exp(-0.5 * z * z) / (sd * SQRT2PI);
    };

    let YValues = xValues.map((item) => {
      if (stat[1] === null || SD === undefined) {
        return null;
      } else {
        const pdfValue = densityNormal(item, stat[1], SD);
        return pdfValue === Infinity ? null : pdfValue;
      }
    });
    setYValues(YValues); // array for Y values
  }, [xValues]);

  // Format the date with the Buddhist year and "BE" format.
  const formatDateBE = (date) => {
    const buddhistYear = date.getFullYear() + 543;
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = date
      .toLocaleDateString("en-US", options)
      .replace(/\d{4}/, `${buddhistYear}`);

    return formattedDate;
  };

  const setCourse = (data) => {
    const course = courseList.filter((c) => c.courseNo === data)[0];
    setSection(course.section);
    setScoreList(course.scores);
  };

  const backToDashboard = () => {
    setCourseList([]);
    setScoreList([]);
    setStat([]);
    searchParams.delete("courseNo");
    searchParams.delete("scoreName");
    setSearchParams(searchParams);
  };

  const onClickCourse = (e) => {
    setCourse(e);
    searchParams.set("courseNo", e);
    setSearchParams(searchParams);
  };

  const backToCourse = () => {
    setCourseList([]);
    setScoreList([]);
    setStat([]);
    searchParams.delete("scoreName");
    setSearchParams(searchParams);
  };

  const onClickScore = async (e) => {
    calStat(e);
    searchParams.set("scoreName", e);
    setSearchParams(searchParams);
  };

  const changeView = () => {
    isShowGraph ? setIsShowGraph(false) : setIsShowGraph(true);
  };

  const calStat = async (data) => {
    const scorePS = scoreList?.filter((s) => s.scoreName === data)[0]?.point;
    if (section && data && !scores) {
      const resp = await getScoresCourse({
        section: section,
        courseNo: searchParams.get("courseNo"),
        scoreName: data,
      });
      if (resp) {
        setScores(resp.results);
        setFullScore(resp.fullScore);
      }
    }
    if (scores) {
      let dataSort = [];
      num = scores.length;
      scores.sort((a, b) => a.point - b.point);
      scores.map((e) => dataSort.push(e.point));
      setXValues(dataSort);
      scores.map((e) => (mean += e.point));
      mean = (mean / num).toFixed(2);
      max = scores[num - 1].point;
      median =
        num % 2 === 0
          ? (
              (scores[parseInt(num / 2) - 1].point +
                scores[parseInt(num / 2)].point) /
              2
            ).toFixed(2)
          : scores[parseInt(num / 2)].point.toFixed(2);
      const posQ1 = (num + 1) * (1 / 4) - 1;
      const posQ3 = (num + 1) * (3 / 4) - 1;
      const baseQ1 = Math.floor(posQ1);
      const baseQ3 = Math.floor(posQ3);
      q1 = (
        scores[baseQ1].point +
        (posQ1 - baseQ1) * (scores[baseQ1 + 1].point - scores[baseQ1].point)
      ).toFixed(2);
      q3 = Number(scores[baseQ3].point.toFixed(2));
      if (baseQ3 + 1 < scores.length) {
        q3 = (
          q3 +
          (posQ3 - baseQ3) * (scores[baseQ3 + 1].point - scores[baseQ3].point)
        ).toFixed(2);
      }
      let x = 0;
      scores.map((e) => (x += Math.pow(e.point - mean, 2)));
      setSD(Math.sqrt(x / num).toFixed(2));
    }

    setStat([scorePS, mean, max, median, q1, q3]);
  };

  const data = {
    labels: [...xValues],
    datasets: [
      {
        data: [...yValues],
        lineTension: 0.5,
        yAxisID: "y",
      },
    ],
  };

  const statLine = [];
  for (let i = 0; i < title.length; i++) {
    if (i !== 2) {
    
    const smScreen = 640; 
    const mdScreen = 860; 
    const lgScreen = 1024;

    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let fontSize = 15;
    if (windowWidth <= smScreen) {
      fontSize = 14;
    } else if (windowWidth <= mdScreen ) {
      fontSize = 16; 
    } else if (windowWidth >= lgScreen) {
      fontSize = 17; 
    }
    
      statLine.push({
        type: "line",
        label: {
          content: `${title[i]} ${stat[i]}`,
          display: true,
          position: "start",
          yAdjust: i === 1 ? 10 : i === 0 ? -20 : i * 15,
          xAdjust: 5,
          // rotation: i === 0 ? 90 : 0,
          color: colorProgress[i],
          backgroundColor: "rgb(0,0,0,0)",
          font: {
            size: fontSize,
            fontFamily: "SF PRo, sans-serif",
          },
        },
        value: stat[i],
        borderColor: colorProgress[i],
        borderDash: [6, 6],
        borderWidth: 2,
        scaleID: "x",
      });
    }
  }

  return (
    <div
      className="mt-20 
                    xl:px-10 lg:px-8 md:px-7 sm:px-6 px-5
                   "
    >
      {searchParams.get("courseNo") && (
        <div
          className="mx-[0%] max-h-screen
                        xl:mt-28 lg:mt-24 md:mt-24 sm:mt-15 mt-20
                        xl:-mb-6 lg:-mb-6 md:mb-4 sm:mb-3 mb-4 "
        >
          <div className=" pb-2 lg:-mt-5 md:-mt-4 -mt-3 ">
            <p
              className={`flex flex-row items-center justify-content font-normal text-primary gap-3 
                           xl:text-xl  lg:text-xl  md:text-lg  sm:text-lg  text-base`}
            >
              <label onClick={backToDashboard} className="cursor-pointer">
                Dashboard
              </label>
              <HiChevronRight className="text-2xl" />
              <label
                onClick={backToCourse}
                style={{
                  cursor: searchParams.get("scoreName") ? "pointer" : null,
                }}
              >
                {searchParams.get("courseNo")}
              </label>
              {searchParams.get("scoreName") && (
                <>
                  <HiChevronRight className="text-2xl" />
                  <label>{searchParams.get("scoreName")}</label>
                </>
              )}
            </p>
            <div className="mt-3 border-b-[3px] border-primary shadow-inset-md opacity-25"></div>
          </div>
        </div>
      )}
      {/* MENU */}
      <div className="max-h-fit xl:m-1  ">
        <div className=" text-maintext font-semibold  ">
          <div
            className="flex items-end  xl:py-5 lg:py-5 md:py-4 sm:py-4 py-3
                          xl:mt-5 lg:mt-5 md:-mt-4 sm:-mt-4 -mt-4
                          "
          >
            <div
              className="flex-col flex w-full"
              style={{
                fontFamily: "'SF PRo', sans-serif",
              }}
            >
              <span //big text topic
                className="xl:text-5xl lg:text-5xl md:text-5xl sm:text-4xl text-4xl md:mt-1"
              >
                {!searchParams.get("courseNo") && "Dashboard"}
                {searchParams.get("courseNo") &&
                  !searchParams.get("scoreName") &&
                  searchParams.get("courseNo")}
                {searchParams.get("scoreName") && searchParams.get("scoreName")}
              </span>
              <span className="xl:text-2xl lg:text-2xl md:text-2xl sm:text-xl text-lg  font-normal">
                {formatDateBE(currentDate)}
              </span>
            </div>

            {searchParams.get("scoreName") && (
              <div className=" flex justify-end items-center w-full">
                <div
                  className="text-primary flex  border-primary border-2 px-3 py-2 rounded-xl
                             hover:text-white hover:bg-primary duration-150 group cursor-pointerbe
                             justify-between items-center gap-3
                            "
                  onClick={changeView}
                >
                  <p className={`xl:textxl lg:text-xl md:text-lg sm:text:lg text-lg `} >
                  {isShowGraph ? (
                    <ImParagraphLeft />
                  ) : (
                    <VscGraph />
                  )}
                  </p>
                  <p className={` xl:text-xl lg:text-xl md:text-lg sm:text:base text-base`}>
                  {isShowGraph ? 
                    "Show Detail" : "Show Graph"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {(message || !searchParams.get("courseNo")) && (
          <div
            className={`flex flex-col gap-3 border-[3px] border-primary rounded-2xl shadow-xl overflow-x-auto
             xl:h-[70vh] lg:h-[70vh] md:h-[77vh] sm:h-[74vh] h-[75vh] 
          `}
          >
            {message && (
              <div className="flex flex-col justify-center text-center items-center overflow-hidden  xl:h-[calc(84vh-205px)] lg:h-[calc(83vh-197px)] md:h-full h-full ">
                <p className="xl:text-3xl lg:text-2xl md:text-xl text-lg text-maintext font-semibold cursor-default">
                  {message}
                </p>
                <span className="xl:text-2xl lg:text-xl md:text-lg text-base text-maintext opacity-60 cursor-default">
                  No course scores released.
                </span>
              </div>
            )}
            <div className="mt-0">
              {!searchParams.get("courseNo") &&
                courseList.map((item, key) => {
                  return (
                    <div
                      key={key}
                      className="xl:px-5 lg:px-5 md:px-4 sm:px-3 px-3
                               xl:mt-5 lg:mt-5  md:mt-4  sm:mt-3  mt-3
                "
                    >
                      <div
                        className=" bg-primary  rounded-xl group active:bg-maintext hover:bg-secondary
                               xl:py-2 lg:py-2 md:py-2 sm:py-1 py-1"
                        onClick={() => onClickCourse(item.courseNo)}
                      >
                        {/* <div className={Student.courseName}> */}
                        <div className=" px-5 py-1 font-semibold group-hover:cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div className="text-white lg:text-2xl text-lg">
                              {item.courseNo} - {item.courseName}
                              <div
                                className=" text-[#F7C878] lg:text-[20px] text-[16px] font-normal"
                                style={{
                                  fontFamily: "'SF PRo', sans-serif",
                                }}
                              >
                                Section {item.section}
                              </div>
                            </div>

                            <HiChevronRight className="text-4xl text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {(searchParams.get("courseNo") || searchParams.get("scoreName")) && (
          <div
            className={`"flex flex-col border-[3px] border-primary rounded-2xl shadow-xl overflow-y-auto
             xl:h-[60vh] lg:h-[62vh] md:h-[63vh] sm:h-[67vh] h-[67vh] "
          `}
          >
            <div
               className={`xl:px-5 lg:px-5 md:px-4 sm:px-3 px-3 ${
                !searchParams.get("scoreName") ? "xl:mt-5 lg:mt-5 md:mt-4 sm:mt-3 mt-3" : ""
              }`}
            >
              {searchParams.get("courseNo") &&
                !searchParams.get("scoreName") &&
                scoreList.map((item, key) => {
                  return (
                    <div
                      key={key}
                      className=" bg-primary rounded-xl group active:bg-maintext hover:bg-secondary
                              xl:py-3 lg:py-2 md:py-2 sm:py-1 py-1
                              xl:mb-3 lg:mb-5 md:mb-4 sm:mb-3 mb-3"
                      onClick={() => onClickScore(item.scoreName)}
                    >
                      {/* <div className={Student.courseName}> */}
                      <div className="  px-5 py-1 font-semibold group-hover:cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div
                            className="text-white lg:text-2xl text-lg"
                            style={{
                              fontFamily: "'SF PRo', sans-serif",
                            }} //not global font**
                          >
                            {item.scoreName}
                          </div>
                          <HiChevronRight className="text-4xl text-white" />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {searchParams.get("scoreName") && (
              <>
                {!isShowGraph && (
                  <div className="xl:py-7 lg:py-6 md:py-5 sm:py-5 py-5
                                  xl:pr-10 lg:pr-10 md:pr-10 
                                  px-10">
                    <div className="flex w-full justify-end text-maintext font-bold
                                    xl:text-[25px] lg:text-[25px]  md:text-[25px]   sm:text-xl  text-xl
                                   ">
                      Full Score: {fullScore}
                    </div>
                    {stat.map((e, i) => (
                      <div key={i} className="py-2 ">
                        <div
                          className={`${
                            i === 0 ? "xl:text-[23px] lg:text-[23px]   md:text-xl   sm:text-lg  text-lg" : 
                                      "xl:text-[21px] lg:text-[21px]   md:text-lg  sm:text-base  text-base"
                          } py-2 font-semibold`}
                          style={{ color: colorProgress[i] }}
                        >
                          {title[i]} : <span className="font-normal">{e}</span>
                        </div>
                        <Progress
                          value={(e * 100) / fullScore}
                          radius={10}
                          color={colorProgress[i]}
                          bg="#D9D9D9"
                        />
                      </div>
                    ))}
                    <div className="text-black  xl:text-[21px] lg:text-[21px]   md:text-[21px]  sm:text-lg  text-lg pt-4 font-semibold">
                      SD : <span className="font-normal ">{SD}</span>
                    </div>
                  </div>
                )}
                {isShowGraph && (
                  <div className="h-full
                                  xl:p-10 lg:p-8 md:p-7 sm:p-6 p-5">
                    <Line
                      data={data}
                      options={{
                        scales: {
                          x: {
                            type: "linear",
                            position: "bottom",
                          },
                          y: {
                            type: "linear",
                            position: "left",
                          },
                        },
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          annotation: {
                            clip: false,
                            annotations: statLine,
                          },
                        },
                        animation: false,
                        elements: {
                          point: {
                            radius: 0,
                          },
                          line: {
                            borderColor: "black",
                            borderWidth: 1,
                          },
                        },
                        events: [],
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
