import "./Preview.css";
import { useLocation, useNavigate } from "react-router";
import NavLayout from "../../layout/NavLayout";
import AuthGuard from "../../layout/AuthGuard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createBlog, editBlog } from "../../services/api";
import { BASE_URL } from "../../utils/constants";

const Preview = () => {
	const navigate = useNavigate();
	const { state, pathname } = useLocation();

	const [img, setImg] = useState<string>();

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
		form.append("category", category);

		try {
			let res: any;
			if (state?.id) {
				res = await editBlog({ id: state?.id, data: form });
			} else {
				res = await createBlog(form);
			}
			toast(res?.data?.message);
			window.onpopstate = null;
			navigate("/home", { replace: true });
		} catch (e: any) {
			console.log("e", e);
			toast(e?.response?.message?.toString() ?? "Something went wrong");
		}
	};

	return (
		<AuthGuard>
			<NavLayout>
				<div className="preview-container">
					<>
						<h3 className="preview-title">{state?.title}</h3>
						<div className="preview-image-container">
							<img src={img} className="preview-image" />
						</div>
						<p className="preview-content">{`${state?.content}`}</p>

						<i style={{ lineHeight: 10 }}>{`Written by - ${
							state?.email?.split("@")[0] ?? "me"
						}`}</i>
					</>

					<div
						className="preview-blog-button"
						onClick={() => {
							submit();
						}}
					>
						Post
					</div>
				</div>
			</NavLayout>
		</AuthGuard>
	);
};
export default Preview;
