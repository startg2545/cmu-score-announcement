import { ROLE, PAGE } from "../context/enum";

async function CheckPermission(userRole, page) {
  if (ROLE.INSTRUCTOR === userRole) {
    return PAGE.INSTRUCTOR.includes(page);
  } else if (ROLE.STUDENT === userRole) {
    return PAGE.STUDENT.includes(page);
  } else {
    return false;
  }
}

export { CheckPermission };