import "./NavBar.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const NavBar = () => {
	const navigate = useNavigate();
	const pathName = useLocation().pathname;

	const [isLoggedIn, setIsLoggedIn] = useState(
		localStorage.getItem("token") ? true : false
	);

	useEffect(() => {
		setIsLoggedIn(localStorage.getItem("token") ? true : false);
	}, [localStorage.getItem("token")]);

	const style = (path: string) => ({
		color: pathName === path ? "#a595ca" : "white",
		fontWeight: pathName === path ? "bold" : "",
	});

	const navigateToLogin = ({ isLogin }: { isLogin: boolean }) => {
		navigate("/login", { state: { isLogin } });
	};

	return (
		<nav className="container">
			<div className="left-container">
				<a href="/home" className="link" style={style("/home")}>
					Home
				</a>
				<a href="/explore" className="link" style={style("/explore")}>
					Explore
				</a>
				{/* <a href="/aboutUs" className="link" style={style("/aboutUs")}>
					About us
				</a> */}
				<a href="/create" className="link" style={style("/create")}>
					Create
				</a>
				{isLoggedIn ? (
					<a href="/profile" className="link" style={style("/profile")}>
						Profile
					</a>
				) : (
					<></>
				)}
			</div>
			<div className="left-container">
				{isLoggedIn ? (
					<div
						className="button"
						onClick={() => {
							setIsLoggedIn(false);
							localStorage.removeItem("token");
							navigateToLogin({ isLogin: true });
						}}
					>
						Logout
					</div>
				) : (
					<>
						<div
							className="button"
							onClick={() => navigateToLogin({ isLogin: true })}
						>
							Login
						</div>
						<div
							className="button-left"
							onClick={() => navigateToLogin({ isLogin: false })}
						>
							Sign Up
						</div>
					</>
				)}
			</div>
		</nav>
	);
};

export default NavBar;
