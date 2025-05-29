import "./Login.css";
import { Images } from "../../assets";
import { ChangeEvent, CSSProperties, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { googleLogin, login, signUp } from "../../services/api";
import { regex } from "../../utils/constants";
import { useLocation, useNavigate } from "react-router";
import { setLogin } from "../../store/login";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { ThreeCircles } from "react-loader-spinner";

interface IInput {
	placeholder?: string;
	style?: CSSProperties;
	value?: string;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	isPassword?: boolean;
}

interface IButton {
	text?: string;
	onClick?: () => void;
	isDisabled?: boolean;
}

interface IFrom {
	isLoginn?: boolean;
	toggleLoading: ({ val }: { val: boolean }) => void;
}

const Input = ({ placeholder, style, onChange, value, isPassword }: IInput) => {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<div className="input-container" style={style}>
			<input
				className="input-box"
				placeholder={placeholder}
				style={{ color: "white" }}
				onChange={onChange}
				value={value}
				type={!showPassword && isPassword ? "password" : "text"}
			/>
			{isPassword ? (
				<div
					className="password-img-container"
					onClick={() => setShowPassword((prev) => !prev)}
				>
					<img
						src={showPassword ? Images.hide : Images.eye}
						className="password-img"
					/>
				</div>
			) : null}
		</div>
	);
};

const Button = ({ text, onClick }: IButton) => {
	return (
		<div id="button" role="button" onClick={onClick}>
			<h4 id="buttonText">{text}</h4>
		</div>
	);
};

const Form = ({ isLoginn, toggleLoading }: IFrom) => {
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLogin, setIsLogin] = useState(isLoginn);

	useEffect(() => {
		clearData();
	}, [isLogin]);

	const clearData = () => {
		setFirstName("");
		setLastName("");
		setEmail("");
		setPassword("");
	};

	const onSubmit = async () => {
		if (!regex.hasOnlyAlphabets.test(firstName) && !isLogin) {
			toast("First name should only contain alphabets");
			return;
		}

		if (!regex.hasOnlyAlphabets.test(lastName) && !isLogin) {
			toast("Last name should only contain alphabets");
			return;
		}

		if (!regex.email.test(email)) {
			toast("Please enter a valid email");
			return;
		}

		if (password.length < 8) {
			toast("Password must be atleast 8 characters long");
			return;
		}

		try {
			toggleLoading({ val: true });
			if (isLogin) {
				const res = await login({ email, password });
				dispatch(setLogin(true));
				localStorage.setItem("token", res?.data?.token);
				toast("Login Successful");
				toggleLoading({ val: false });
				navigate("/home");
			} else {
				const res = await signUp({ email, firstName, lastName, password });
				toast(res?.data?.message);
				setIsLogin((prev) => !prev);
				toggleLoading({ val: false });
			}
			clearData();
		} catch (e: any) {
			toast(e?.response?.data?.message);
			toggleLoading({ val: false });
			return;
		}
	};

	return (
		<div id="centered">
			<div id="form-container">
				<div>
					<div style={{ textAlign: "center" }}>
						<h1 id="title">{isLogin ? "Login" : "Create an account"}</h1>
						<h4 id="subTitle">
							{isLogin
								? "Didn't have an account? "
								: "Already have an account? "}
							<a onClick={() => setIsLogin((prev) => !prev)} href={"#"}>
								{isLogin ? "Sign Up" : "Log in"}
							</a>
						</h4>
					</div>

					{!isLogin ? (
						<div id="input-container">
							<Input
								placeholder={"First Name"}
								style={{ width: "100%" }}
								onChange={(e) => setFirstName(e.target.value)}
								value={firstName}
							/>
							<Input
								placeholder={"Last Name"}
								style={{ width: "100%" }}
								onChange={(e) => setLastName(e.target.value)}
								value={lastName}
							/>
						</div>
					) : null}

					<div style={{ width: "100%" }}>
						<Input
							placeholder={"Email"}
							onChange={(e) => setEmail(e.target.value)}
							value={email}
						/>
						<Input
							placeholder={"Enter Your Password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							isPassword={true}
						/>
						<h5 id="TC">
							I agree to the <a href="">Terms & Conditions</a>
						</h5>
					</div>
				</div>

				<Button
					text={isLogin ? "Login" : "Create Account"}
					onClick={onSubmit}
				/>

				<div id="registerContainer">
					<div id="line" />
					<div style={{ color: "#7a7886" }}>Or register with</div>
					<div id="line" />
				</div>

				<div id="social-container">
					<GoogleLogin
						logo_alignment="center"
						type="standard"
						shape="rectangular"
						size="large"
						theme="filled_blue"
						width={300}
						onSuccess={async (credentialResponse) => {
							toggleLoading({ val: true });
							const res = await googleLogin({
								token: credentialResponse.credential!,
							});
							dispatch(setLogin(true));
							console.log("res", res.data);

							localStorage.setItem("token", res?.data?.token);
							toast("Login Successful");
							console.log("resss", res.data);
							toggleLoading({ val: false });
							navigate("/home");
						}}
						onError={() => {
							console.log("Login Failed");
							toggleLoading({ val: false });
						}}
					/>
				</div>
			</div>
		</div>
	);
};

const Login = () => {
	const { state } = useLocation();
	const [loading, setLoading] = useState(false);

	const toggleLoading = ({ val }: { val: boolean }) => {
		setLoading(val);
	};

	return (
		<div id="layout">
			<div id="container">
				{!loading ? (
					<>
						<img id="side-image" src={Images.login1} alt="img" />
						<Form isLoginn={state?.isLogin} toggleLoading={toggleLoading} />
					</>
				) : (
					<div
						style={{
							flex: 1,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<ThreeCircles color={"#6e54b5"} />
					</div>
				)}
			</div>
		</div>
	);
};

export default Login;
