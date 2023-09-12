import { getAllCourses, getAllSections } from "./cpe";
import { addCourse, addCoInstructors } from "./course";
import { addStudentGrade, getStudentScores } from './student';
import { getScores, getScoresCourse } from "./scores";
import { getUserInfo, signOut } from "./user";

export {
  getAllCourses,
  getAllSections,
  addStudentGrade,
  getStudentScores,
  addCourse,
  addCoInstructors,
  getScores,
  getScoresCourse,
  getUserInfo,
  signOut,
};
