import { Navigate, Route, Routes } from "react-router";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Explore from "./pages/explore/Explore";
import CreateBlog from "./pages/create/CreateBlog";
import Blog from "./pages/blog/Blog";
import Preview from "./pages/preview/Preview";
import Profile from "./pages/profile/Profile";

function App() {
	return (
		<Routes>
			<Route index element={<Navigate to={"/home"} replace={true} />} />
			<Route path="/home" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/explore" element={<Explore />} />
			<Route path="/create" element={<CreateBlog />} />
			<Route path="/blog/:id" element={<Blog />} />
			<Route path="/preview" element={<Preview />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="*" element={<h1>Page Not Found!</h1>} />
		</Routes>
	);
}

export default App;
