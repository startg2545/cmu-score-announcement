import { addCourse, addCoInstructors } from "./course";
import { getCourseName, getAllSections } from "./cpe";
import { getScores, getScoresCourse, getListStudentScores, deleteScores } from "./scores";
import { getStudentScores, addStudentGrade, putStudentGrade } from "./student";
import { getUserInfo, signOut } from "./user";
import { addCurrent, getCurrent, deleteCurrent } from "./admins"

export {
  addCourse,
  addCoInstructors,
  getCourseName,
  getAllSections,
  getScores,
  getScoresCourse,
  getListStudentScores,
  deleteScores,
  getStudentScores,
  addStudentGrade,
  putStudentGrade,
  getUserInfo,
  signOut,
  addCurrent,
  getCurrent,
  deleteCurrent
};
