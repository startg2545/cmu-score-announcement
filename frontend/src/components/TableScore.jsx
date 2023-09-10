import React from "react";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Center, Table } from "@mantine/core";
import { addStudentGrade } from "../services";
import tabStyle from "./css/tableScore.module.css";

const TableScore = ({ data }) => {
  const [isPublic, setIsPublic] = useState(false);
  const [islog, setlog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
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
      data[i].SD = Math.sqrt(x / (e.studentNumber)).toFixed(2);

      
      const Q1 = (e.studentNumber + 1) / 4;
      const Q3 = (3 * (e.studentNumber + 1)) / 4;
      const baseQ1 = Math.floor(Q1);
      const baseQ3 = Math.floor(Q3);
      //calculate Upper Quartile Q3 
      data[i].UpperQu = (sortPoint[baseQ3-1].point + (Q3-baseQ3)*(sortPoint[baseQ3].point - sortPoint[baseQ3-1].point)).toFixed(2);
      //calculate Lower Quartile Q1
      data[i].LowerQu = (sortPoint[baseQ1-1].point + (Q1-baseQ1)*(sortPoint[baseQ1].point - sortPoint[baseQ1-1].point)).toFixed(2);
    });
  }, []);

  const publish = async (el) => {

    const student_schema = {
      courseNo: searchParams.get('courseNo'),
      semester: searchParams.get('semester'),
      year: searchParams.get('year'),
      section: searchParams.get('section'),
      scoreName: el.scoreName,
      results: el.results
    }
    
    console.log('send', student_schema)
    let resp_student = await addStudentGrade(student_schema);
    if (resp_student) console.log("response: ", resp_student)
  }

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

          <div className={tabStyle.publicBT} onClick={()=>publish(element)}>

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
            <div className={`${tabStyle.manageBT} ${tabStyle.deleteBT}`}>
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
    <div >
      <Table withBorder  withColumnBorders verticalSpacing="md" striped fontSize={22} fw={500} style={{border: "1px solid", transform: "translateX(0px)"}} >
        <thead >
          <tr>

            <th className={`${tabStyle.colBig} ${tabStyle.front}`} style={{border: "1px solid"}} >
              <center style={{fontSize: "18px"}} >Assignment</center>
            </th>
            <th className={tabStyle.colSml} style={{border: "1px solid"}}>
              <center style={{fontSize: "18px"}} >
               Student
              </center>
            </th>
            <th className={tabStyle.colSml} style={{border: "1px solid"}}>
              <center style={{fontSize: "18px"}}>Full Score</center>
            </th>
            <th className={tabStyle.colSml} style={{border: "1px solid"}}>
              <center style={{fontSize: "18px"}} >
                Mean<br></br>Section
              </center>
            </th>
            <th className={tabStyle.colSml} style={{border: "1px solid"}}>
              <center style={{fontSize: "18px"}}>
                Mean<br></br>Course
              </center>
            </th>
            <th className={tabStyle.colSml} style={{border: "1px solid"}}>
              <center style={{fontSize: "18px"}}>Median</center>
            </th>
            <th className={tabStyle.colSml}style={{border: "1px solid"}}>
              <center style={{fontSize: "18px"}} >Max</center>
            </th>
            <th className={tabStyle.colSml}style={{border: "1px solid"}}>
              <center style={{fontSize: "18px"}}>SD</center>
            </th>
            <th className={tabStyle.colSml}style={{border: "1px solid"}}>
              <center style={{fontSize: "18px"}}>
                Upper<br></br>Quartile
              </center>
            </th>
            <th className={tabStyle.colSml}style={{border: "1px solid"}}>
              <center style={{fontSize: "18px"}}>
                Lower<br></br>Quartile
              </center>
            </th>
            <th className={tabStyle.colSml } style={{border: "1px solid"}}>
              <center style={{fontSize: "18px"}}>Publish</center>
            </th>
            <th className={`${tabStyle.colBig} ${tabStyle.back}`} style={{border: "1px solid"}}>
              <center style={{fontSize: "18px"}}>Management</center>
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
};
export default TableScore;
