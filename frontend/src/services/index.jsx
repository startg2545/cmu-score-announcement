import { getAllCourses, getAllSections, getTeacher } from "./cpe";
import { addCourse, addCoInstructors } from "./course";
import { addStudentGrade, getStudentScores } from './student';
import { getScores, getScoresCourse } from "./scores";
import { getUserInfo, signOut } from "./user";

export {
  getAllCourses,
  getAllSections,
  getTeacher,
  addStudentGrade,
  getStudentScores,
  addCourse,
  addCoInstructors,
  getScores,
  getScoresCourse,
  getUserInfo,
  signOut,
};
