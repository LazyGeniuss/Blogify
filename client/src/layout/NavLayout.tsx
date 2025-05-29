import React from "react";
import NavBar from "../components/navbar/NavBar";

const NavLayout = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div>
			<NavBar />
			{children}
		</div>
	);
};

export default NavLayout;
