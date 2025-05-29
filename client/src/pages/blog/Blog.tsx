import "./Blog.css";
import NavLayout from "../../layout/NavLayout";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { getBlog, likeBlog } from "../../services/api";
import { toast } from "react-toastify";
import { IBlog } from "../home/Home";
import { Images } from "../../assets";
import { BASE_URL } from "../../utils/constants";
import { ThreeCircles } from "react-loader-spinner";

const Blog = () => {
	const param = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [blogData, setBlogData] = useState<IBlog>();
	const [img, setImg] = useState<string>();
	const [isLiked, setIsLiked] = useState(false);
	const [likes, setLikes] = useState<number>(0);

	const getBlogData = async ({ id }: { id: string }) => {
		try {
			setLoading(true);
			const res = await getBlog({ id });
			setLoading(false);
			setBlogData(res.data?.data);
			setIsLiked(res?.data?.data?.isLiked);
			setLikes(res?.data?.data?.likes?.length);
			setImg(`${BASE_URL}blog/image/${res?.data?.data?._id}`);
		} catch (e: any) {
			console.log("e", e);
			toast(e?.res?.data?.message);
		}
	};

	useEffect(() => {
		if (param?.id) {
			getBlogData({ id: param.id });
		}
	}, [param.id]);

	const likePress = async () => {
		try {
			if (!localStorage.getItem("token")) {
				navigate("/login", { state: { isLogin: true } });
				return;
			}
			setLikes((prev: number) => (isLiked ? prev - 1 : prev + 1));
			setIsLiked((prev) => !prev);
			const res: any = await likeBlog({ id: blogData?._id! });
			console.log("res", res);

			toast(res?.data?.message);
		} catch (e: any) {
			console.log("e", e);
			toast(e?.response?.message);
		}
	};

	return (
		<NavLayout>
			<div className="blog-container">
				{!loading ? (
					<div
						style={{
							// maxWidth: "100%",
							justifyContent: "center",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<h3 className="blog-title">{blogData?.title}</h3>
						{img ? (
							<div className="blog-image-container">
								<img src={img} className="blog-image" />
							</div>
						) : null}
						<div
							style={{
								alignItems: "center",
								justifyContent: "center",
								display: "flex",
								width: "80%",
							}}
						>
							<p className="blog-content">{`${blogData?.content}`}</p>
						</div>
						<div
							style={{
								width: "80%",
							}}
						>
							<div onClick={() => likePress()} className="blog-like-container">
								<img
									src={isLiked ? Images.like : Images.unlike}
									className="blog-like-image"
								/>
								<i>{`${likes} ${likes > 1 ? "likes" : "like"}`}</i>
							</div>

							<i style={{ lineHeight: 10 }}>{`Written by - ${
								blogData?.email?.split("@")[0]
							}`}</i>
						</div>
					</div>
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
		</NavLayout>
	);
};
export default Blog;
