import "./Preview.css";
import { useLocation, useNavigate } from "react-router";
import NavLayout from "../../layout/NavLayout";
import AuthGuard from "../../layout/AuthGuard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createBlog, editBlog } from "../../services/api";
import { BASE_URL } from "../../utils/constants";
import { ThreeCircles } from "react-loader-spinner";

const Preview = () => {
	const navigate = useNavigate();
	const { state, pathname } = useLocation();

	const [img, setImg] = useState<string>();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (state?.image && typeof state?.image != "string") {
			setImg(URL.createObjectURL(state?.image));
		} else {
			setImg(`${BASE_URL}blog/image/${state?.id}`);
		}
	}, [state]);

	useEffect(() => {
		const handleBackButton = () => {
			const { title, content, image, category } = state;
			navigate("/create", {
				state: {
					title,
					content,
					image,
					category,
					lastRoute: pathname,
					id: state?.id,
				},
			});
		};
		window.onpopstate = handleBackButton;
	}, [navigate]);

	const submit = async () => {
		const { title, content, image, category } = state;

		const form = new FormData();

		form.append("title", title);
		form.append("content", content);
		form.append("image", image);
		form.append("category", category.length > 0 ? category : ["Others"]);

		try {
			let res: any;
			setLoading(true);
			if (state?.id) {
				res = await editBlog({ id: state?.id, data: form });
			} else {
				res = await createBlog(form);
			}
			toast(res?.data?.message);
			setLoading(false);
			window.onpopstate = null;
			navigate("/home", { replace: true });
		} catch (e: any) {
			console.log("e", e);
			setLoading(false);
			toast(e?.response?.message?.toString() ?? "Something went wrong");
		}
	};

	return (
		<AuthGuard>
			<NavLayout>
				<div className="preview-container">
					{!loading ? (
						<>
							<>
								<h3 className="preview-title">{state?.title}</h3>
								<div className="preview-image-container">
									<img src={img} className="preview-image" />
								</div>
								<p className="preview-content">{`${state?.content}`}</p>

								<div>{`Category : ${state?.category?.at(0) ?? "Unknown"}`}</div>

								<div style={{ margin: "50px 0" }}>
									<i style={{ lineHeight: 1 }}>{`Written by - ${
										state?.email?.split("@")[0] ?? "me"
									}`}</i>
								</div>
							</>

							<div
								className="preview-blog-button"
								onClick={() => {
									submit();
								}}
							>
								Post
							</div>
						</>
					) : (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								minWidth: "65vw",
								minHeight: "60vh",
							}}
						>
							<ThreeCircles color={"#6e54b5"} />
						</div>
					)}
				</div>
			</NavLayout>
		</AuthGuard>
	);
};
export default Preview;
