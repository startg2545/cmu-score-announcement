import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Course from "./css/course166.module.css";
import { getStudentScores, getAllCourses, getScoresCourse } from "../services";
import { HiChevronRight } from "react-icons/hi";
import { VscGraph } from "react-icons/vsc";
import { ImParagraphLeft } from "react-icons/im";
import { useMediaQuery } from "@mantine/hooks";
import { Flex, Title, Text, Progress, Button, Affix } from "@mantine/core";

export default function StudentDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [message, setMessage] = useState();
  const [courseList, setCourseList] = useState();
  const [section, setSection] = useState();
  const [scoreList, setScoreList] = useState();
  const [scores, setScores] = useState();
  const [searchParams, setSearchParams] = useSearchParams({});
  const [params, setParams] = useState({});
  const [isSelectedCourse, setSelectedCourse] = useState(false);
  const [isSelectedScore, setSelectedScore] = useState(false);
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
  const colorProgress = [
    "#696CA3",
    "#FF7A00",
    "#429195",
    "#B05F99",
    "#318A5F",
    "#4868DB",
  ];
  const [stat, setStat] = useState([]);
  const [SD, setSD] = useState(0);
  const [fullScore, setFullScore] = useState();

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
            data.courseGrades.forEach((e, index) => {
              allCourse.forEach((all) => {
                if (e.courseGrades.courseNo === all.courseNo) {
                  data.courseGrades[index].courseName = all.courseNameEN;
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
      setSelectedCourse(true);
    }
    if (params.scoreName) {
      calStat(params.scoreName);
      setSelectedScore(true);
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

  const calStat = async (data) => {
    let mean = 0,
      max = 0,
      median = 0,
      q1 = 0,
      q3 = 0,
      num = 0;
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
      num = scores.length;
      scores.sort((a, b) => a.point - b.point);
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

  const backToDashboard = () => {
    setSelectedCourse(false);
    setSelectedScore(false);
    searchParams.delete("courseNo");
    searchParams.delete("scoreName");
    setSearchParams(searchParams);
  };

  const onClickCourse = (e) => {
    setCourse(e);
    setSelectedCourse(true);
    setSelectedScore(false);
    searchParams.set("courseNo", e);
    setSearchParams(searchParams);
  };

  const backToCourse = () => {
    setSelectedCourse(true);
    setSelectedScore(false);
    searchParams.delete("scoreName");
    setSearchParams(searchParams);
  };

  const onClickScore = async (e) => {
    calStat(e);
    setSelectedScore(true);
    searchParams.set("scoreName", e);
    setSearchParams(searchParams);
  };

  const changeView = () => {
    isShowGraph ? setIsShowGraph(false) : setIsShowGraph(true);
  };

  return (
    <>
      {isSelectedCourse && (
        <div className={Course.MenuIndexLayout} style={{ marginInline: 25 }}>
          <div className={Course.MenuNavigate}>
            <p className={Course.MenuIndex}>
              <label
                onClick={backToDashboard}
                style={{ cursor: "pointer" }}
                className={Course.date}
              >
                Dashboard
              </label>
              <HiChevronRight />
              <label
                onClick={backToCourse}
                style={{ cursor: isSelectedScore ? "pointer" : null }}
                className={Course.date}
              >
                {params.courseNo}
              </label>
              {isSelectedScore && (
                <>
                  <HiChevronRight />
                  <label className={Course.date}>{params.scoreName}</label>
                </>
              )}
            </p>
          </div>
          <div className={Course.lineIndex} style={{ marginTop: -15 }}></div>
        </div>
      )}
      {isSelectedScore && (
        <Affix position={{ top: 150, right: 20 }}>
          <Button
            variant="outline"
            ff={"SF PRo, sans-serif"}
            w={150}
            radius={20}
            sx={{
              // color: "#696CA3",
              ":hover": { backgroundColor: "lightgray" },
              // borderColor: "#696CA3",
              border: "3px solid",
            }}
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
      <Text
        className={Course.coursetopictext}
        w="fit-content"
        fz={20}
        style={{ marginTop: isSelectedCourse ? -8 : 0 }}
      >
        {!isSelectedCourse && "Dashboard"}
        {isSelectedCourse && !isSelectedScore && params.courseNo}
        {isSelectedScore && params.scoreName}
      </Text>
      <Text
        className={Course.datetext}
        w="fit-content"
        style={{ marginTop: isSelectedCourse ? 0 : 0 }}
      >
        {formatDate(currentDate)}
      </Text>
      <div
        className={Course.courseframewindow}
        style={{
          gap: 10,
          marginTop: isSelectedCourse ? 4 : 0,
          justifyContent: message ? "center" : null,
          height: 550
        }}
      >
        {message && (
          <Text
            ff={"SF PRo, sans-serif"}
            fz={isMobileOrTablet ? 25 : 40}
            fw={550}
            color="#696CA3"
          >
            {message}
          </Text>
        )}
        {!isSelectedCourse &&
          courseList &&
          courseList.map((item, key) => {
            return (
              <div
                key={key}
                className={Course.frameEachCourse}
                onClick={() => onClickCourse(item.courseNo)}
              >
                <div className={Course.courseName}>
                  <div className={Course.intoCourse}>
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
        {isSelectedCourse &&
          !isSelectedScore &&
          scoreList &&
          scoreList.map((item, key) => {
            return (
              <div
                key={key}
                className={Course.frameEachCourse}
                onClick={() => onClickScore(item.scoreName)}
              >
                <div className={Course.courseName}>
                  <div className={Course.intoCourse}>{item.scoreName}</div>
                </div>
              </div>
            );
          })}
        {isSelectedScore && scoreList && stat && (
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
            {isShowGraph && <></>}
          </>
        )}
      </div>
    </>
  );
}
