import { addCourse, addCoInstructors, deleteCourseReally } from "./course";
import { getCourseName, getAllSections } from "./cpe";
import {
  getScores,
  getScoresCourse,
  getListStudentScores,
  deleteScores,
} from "./scores";
import { getStudentScores, addStudentGrade, putStudentGrade } from "./student";
import { getUserInfo, signOut } from "./user";
import {
  getAdminUser,
  addAdmin,
  deleteAdmin,
  addCurrent,
  getCurrent,
  deleteCurrent,
} from "./admins";
import { socket } from "./socket";

export {
  addCourse,
  addCoInstructors,
  deleteCourseReally,
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
  getAdminUser,
  addAdmin,
  deleteAdmin,
  addCurrent,
  getCurrent,
  deleteCurrent,
  socket,
};
