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
					<NavLink to="/grade" activestyle="true">
						Grades
					</NavLink>
					<NavLink to="/sign-up" activestyle="true">
						Sign Up
					</NavLink>
					<NavLink to="/score-announcement" activestyle="true">
						Score Announcement
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
