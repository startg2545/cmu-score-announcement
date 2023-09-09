import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Course from "./css/course166.module.css";
import "./studentDashboard.css";
import { getStudentScores, getAllCourses, getScores, getScoresCourse } from "../services";
import UserInfoContext from "../context/userInfo";
import { HiChevronRight } from "react-icons/hi";
import { useMediaQuery } from "@mantine/hooks";
import { Flex, Title, Text, Progress } from "@mantine/core";

export default function StudentDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [courseList, setCourseList] = useState(null);
  const [section, setSection] = useState(null);
  const [scoreList, setScoreList] = useState(null);
  const [score, setScore] = useState(null);
  const { userInfo } = useContext(UserInfoContext);
  const [searchParams, setSearchParams] = useSearchParams({});
  const [params, setParams] = useState({});
  const [isSelectedCourse, setSelectedCourse] = useState(false);
  const [isSelectedScore, setSelectedScore] = useState(false);
  const isMobileOrTablet = useMediaQuery(
    "(max-width: 1024px) and (max-height: 1400px)"
  );
  const title = [
    "Your Score",
    "Mean",
    "Max",
    "Median",
    "Upper Quartile",
    "Lower Quartile",
  ];
  const colorProgress = [
    "#696CA3",
    "#FF7A00",
    "#429195",
    "#B05F99",
    "#318A5F",
    "#4868DB",
  ];
  const [stat, setStat] = useState(null);
  const [SD, setSD] = useState(0);
  const [fullScore, setFullScore] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    const fetchData = async () => {
      if (userInfo.studentId) {
        const allCourse = await getAllCourses();
        const data = await getStudentScores(userInfo.studentId);
        if (data) {
          if (allCourse.ok) {
            data.courseGrades.forEach((e, index) => {
              allCourse.forEach((all) => {
                if (e.courseGrades.courseNo === all.courseNo) {
                  data.courseGrades[index].courseName = all.courseNameEN;
                }
              });
            });
          }
          setCourseList(data.courseGrades);
        }
      }
    };
    if (!courseList) fetchData();
    if (isSelectedScore && !stat) calStat();
    setParams({
      courseNo: searchParams.get("courseNo"),
      scoreName: searchParams.get("scoreName"),
    });

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [userInfo, score, searchParams, isSelectedCourse]);

  // Function to format the date as "XX Aug, 20XX"
  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const backToDashboard = () => {
    setSelectedCourse(false);
    setSelectedScore(false);
    searchParams.delete("courseNo");
    searchParams.delete("scoreName");
    setSearchParams(searchParams);
  };

  const onClickCourse = (e) => {
    const course = courseList.filter((c) => c.courseNo === e)[0];
    setSection(course.section);
    setScoreList(course.scores);
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

  const calStat = () => {
    let mean = 0,
      max = 0,
      median = 0,
      uq = 0,
      lq = 0;

    setStat([score.point, mean, max, median, uq, lq]);
  };

  const onClickScore = async (e) => {
    const resp = await getScoresCourse({section: section, courseNo: params.courseNo, scoreName: params.scoreName});
    setScore(scoreList.filter((s) => s.scoreName === e)[0]);
    if (score) calStat();
    setSelectedScore(true);
    searchParams.set("scoreName", e);
    setSearchParams(searchParams);
  };

  return (
    <>
      {isSelectedCourse && (
        <div className={Course.MenuIndexLayout}>
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
          <div className={Course.lineIndex}></div>
        </div>
      )}
      <Text className={Course.coursetopictext} w="fit-content">
        {!isSelectedCourse && "Dashboard"}
        {isSelectedCourse && !isSelectedScore && params.courseNo}
        {isSelectedScore && params.scoreName}
      </Text>
      <Text className={Course.datetext} w="fit-content">
        {formatDate(currentDate)}
      </Text>
      <div
        className={Course.courseframewindow}
        style={{ gap: 10, marginTop: isSelectedCourse ? 12 : 0 }}
      >
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
                    {/* <div className="stuCouListcourseSection">
                      Section: {item.section}
                    </div> */}
                  </div>
                </div>
              </div>
            );
          })}
        {isSelectedCourse &&
          !isSelectedScore &&
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
        {isSelectedScore && (
          <Flex direction="column" mt={10} gap={25}>
            {stat && stat.map((e, i) => (
              <Flex key={i} direction="column" gap={10}>
                <Title
                  order={3}
                  color={colorProgress[i]}
                  ff={"SF PRo, sans-serif"}
                >
                  {title[i]}: {i === 0 ? `${e}/` : e}
                </Title>
                <Progress
                  mt={-10}
                  value={e}
                  size={12}
                  w={650}
                  color={colorProgress[i]}
                  bg="#D9D9D9"
                />
              </Flex>
            ))}
            <Title order={3} color="#696CA3" ff={"SF PRo, sans-serif"}>
              SD: {SD}
            </Title>
          </Flex>
        )}
      </div>
    </>
  );
}
