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
					<NavLink to="/add-score" activestyle="true">
						Add Score
					</NavLink>
					<NavLink to="/sign-up" activestyle="true">
						Sign Up
					</NavLink>
					<NavLink to="/search-course" activestyle="true">
						Search Course
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
