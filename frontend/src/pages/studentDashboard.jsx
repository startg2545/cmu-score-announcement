import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Student from "./css/studentDashboard.module.css";
import { getStudentScores, getAllCourses, getScoresCourse } from "../services";
import { HiChevronRight } from "react-icons/hi";
import { VscGraph } from "react-icons/vsc";
import { ImParagraphLeft } from "react-icons/im";
import { useMediaQuery } from "@mantine/hooks";
import { Flex, Title, Text, Progress, Button, Affix } from "@mantine/core";
import { Chart } from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";

Chart.register(annotationPlugin);

export default function StudentDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [message, setMessage] = useState();
  const [courseList, setCourseList] = useState();
  const [section, setSection] = useState();
  const [scoreList, setScoreList] = useState();
  const [scores, setScores] = useState();
  const [searchParams, setSearchParams] = useSearchParams({});
  const [params, setParams] = useState({});
  const [isShowGraph, setIsShowGraph] = useState(false);
  const isMobileOrTablet = useMediaQuery(
    "(max-width: 1024px) and (max-height: 1400px)"
  );
  const title = [
    "Your Score",
    "Mean",
    "Max",
    "Median",
    "Lower Quartile",
    "Upper Quartile",
  ];
  const colorProgress = ["blue", "red", "#429195", "green", "purple", "orange"];
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    const fetchData = async () => {
      const allCourse = await getAllCourses();
      const data = await getStudentScores();
      if (data) {
        if (data.ok) {
          if (allCourse.ok) {
            data.scores.courseGrades.forEach((e, index) => {
              allCourse.courseDetails.forEach((all) => {
                if (e.courseNo === all.courseNo) {
                  data.scores.courseGrades[index].courseName = all.courseNameEN;
                }
              });
            });
          }
          setCourseList(data.scores.courseGrades);
        } else {
          setMessage(data.message);
        }
      }
    };

    if (!courseList && !message) fetchData();
    if (params.courseNo) {
      setCourse(params.courseNo);
    }
    if (params.scoreName) {
      calStat(params.scoreName);
    }

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [courseList, section, scores]);

  useEffect(() => {
    setParams({
      courseNo: searchParams.get("courseNo"),
      scoreName: searchParams.get("scoreName"),
    });
    if (!params.scoreName) {
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

  // Function to format the date as "XX Aug, 20XX"
  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const setCourse = (data) => {
    const course = courseList?.filter((c) => c.courseNo === data)[0];
    setSection(course?.section);
    setScoreList(course?.scores);
  };

  const backToDashboard = () => {
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
        courseNo: params.courseNo,
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
      const posQ1 = (num + 1) * (1 / 4);
      const posQ3 = (num + 1) * (3 / 4);
      const baseQ1 = Math.floor(posQ1);
      const baseQ3 = Math.floor(posQ3);
      q1 = (
        scores[baseQ1 - 1].point +
        (posQ1 - baseQ1) * (scores[baseQ1].point - scores[baseQ1 - 1].point)
      ).toFixed(2);
      q3 = (
        scores[baseQ3 - 1].point +
        (posQ3 - baseQ3) * (scores[baseQ3].point - scores[baseQ3 - 1].point)
      ).toFixed(2);
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
      statLine.push({
        type: "line",
        label: {
          content: title[i],
          display: true,
          position: "end",
          // yAdjust: -100,
          xAdjust: 8,
          rotation: 90,
          color: colorProgress[i],
          backgroundColor: "rgb(0,0,0,0)",
          font: {
            size: 15,
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
    <>
      {params.courseNo && (
        <div className={Student.MenuIndexLayout}>
          <div className={Student.MenuNavigate}>
            <p className={Student.MenuIndex}>
              <label
                onClick={backToDashboard}
                style={{ cursor: "pointer" }}
                className={Student.date}
              >
                Dashboard
              </label>
              <HiChevronRight />
              <label
                onClick={backToCourse}
                style={{ cursor: params.scoreName ? "pointer" : null }}
                className={Student.date}
              >
                {params.courseNo}
              </label>
              {params.scoreName && (
                <>
                  <HiChevronRight />
                  <label className={Student.date}>{params.scoreName}</label>
                </>
              )}
            </p>
          </div>
          <div className={Student.lineIndex}></div>
        </div>
      )}
      {params.scoreName && (
        <Affix position={{ top: 150, right: 20 }}>
          <Button
            className={Student.showGraphBT}
            onClick={changeView}
            leftIcon={
              isShowGraph ? (
                <ImParagraphLeft size={20} />
              ) : (
                <VscGraph size={23} />
              )
            }
          >
            {isShowGraph ? "Show Detail" : "Show Graph"}
          </Button>
        </Affix>
      )}
      <Text className={Student.coursetopictext}>
        {!params.courseNo && "Dashboard"}
        {params.courseNo && !params.scoreName && params.courseNo}
        {params.scoreName && params.scoreName}
      </Text>
      <Text className={Student.datetext}>
        {formatDate(currentDate)}
      </Text>
      <div className={Student.courseframewindow}>
        {message && <Text className={Student.message}>{message}</Text>}
        {!params.courseNo &&
          courseList &&
          courseList.map((item, key) => {
            return (
              <div
                key={key}
                className={Student.frameEachCourse}
                onClick={() => onClickCourse(item.courseNo)}
              >
                <div className={Student.courseName}>
                  <div className={Student.intoCourse}>
                    {item.courseNo}
                    {item.courseName ? ` - ${item.courseName}` : null}
                    <Text
                      color="#F7C878"
                      ff="SF Pro"
                      fz={isMobileOrTablet ? 16 : 20}
                      ta="left"
                      lh="normal"
                    >
                      Section: {item.section}
                    </Text>
                  </div>
                </div>
              </div>
            );
          })}
        {params.courseNo &&
          !params.scoreName &&
          scoreList &&
          scoreList.map((item, key) => {
            return (
              <div
                key={key}
                className={Student.frameEachCourse}
                onClick={() => onClickScore(item.scoreName)}
              >
                <div className={Student.courseName}>
                  <div className={Student.intoCourse}>{item.scoreName}</div>
                </div>
              </div>
            );
          })}
        {params.scoreName && scoreList && stat && (
          <>
            {!isShowGraph && (
              <Flex direction="column" mt={15} gap={25}>
                <Title
                  ta="right"
                  order={3}
                  color="#696CA3"
                  ff={"SF PRo, sans-serif"}
                  fz={isMobileOrTablet ? 20 : 25}
                >
                  Full Score: {fullScore}
                </Title>
                {stat.map((e, i) => (
                  <Flex key={i} direction="column" gap={12}>
                    <Title
                      mt={i === 0 ? (isMobileOrTablet ? -20 : -45) : 0}
                      order={3}
                      color={colorProgress[i]}
                      ff={"SF PRo, sans-serif"}
                      fz={
                        isMobileOrTablet
                          ? i === 0
                            ? 30
                            : 20
                          : i === 0
                          ? 30
                          : 25
                      }
                      fw={i === 0 ? 700 : 500}
                    >
                      {title[i]}: {e}
                    </Title>
                    <Progress
                      mt={-10}
                      value={(e * 100) / fullScore}
                      size={isMobileOrTablet ? 12 : 14}
                      w={isMobileOrTablet ? 650 : 1430}
                      radius={10}
                      color={colorProgress[i]}
                      bg="#D9D9D9"
                    />
                  </Flex>
                ))}
                <Title
                  order={3}
                  color="#696CA3"
                  ff={"SF PRo, sans-serif"}
                  fz={isMobileOrTablet ? 20 : 25}
                >
                  SD: {SD}
                </Title>
              </Flex>
            )}
            {isShowGraph && (
              <Line
                data={data}
                options={{
                  scales: {
                    x: {
                      type: "linear",
                      position: "bottom",
                      min: 0,
                      max: fullScore,
                    },
                    y: {
                      type: "linear",
                      position: "left",
                    },
                  },
                  layout: {
                    padding: {
                      // right: 25,
                      // left: 25,
                      // top: 100,
                      // // bottom: -90,
                    },
                  },
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
            )}
          </>
        )}
      </div>
    </>
  );
}
