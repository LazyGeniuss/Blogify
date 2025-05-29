import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";

interface IAuthGuard {
	children: React.ReactNode;
}

const AuthGuard = ({ children }: IAuthGuard) => {
	const [isLoggedIn, setIsLoggedIn] = useState(
		localStorage.getItem("token") ? true : false
	);

	useEffect(() => {
		setIsLoggedIn(localStorage.getItem("token") ? true : false);
	}, [localStorage.getItem("token")]);

	if (!isLoggedIn) {
		return <Navigate to={"/login"} replace={true} state={{ isLogin: true }} />;
	}

	return <>{children}</>;
};

export default AuthGuard;
