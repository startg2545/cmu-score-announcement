import React from "react";
import {Nav, NavMenu, NavLink} from './NavbarElements'

const Navbar = () => {
	return (
		<>
			<Nav>
				<NavMenu>
					<NavLink to="/about" activestyle="true">
						About
					</NavLink>
					<NavLink to="/contact" activestyle="true">
						Contact Us
					</NavLink>
					<NavLink to="/search-course" activestyle="true">
						Search Course
					</NavLink>
					<NavLink to="/course-detail" activestyle="true">
						Course Detail
					</NavLink>
					<NavLink to="/student-dashboard" activestyle="true">
						Student Dashboard
					</NavLink>
				</NavMenu>
			</Nav>
		</>
	);
};

export default Navbar;
