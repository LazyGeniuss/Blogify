import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import AuthGuard from "../../layout/AuthGuard";
import { geminiApi } from "../../services/api";
import "./CreateBlog.css";
import { ThreeCircles } from "react-loader-spinner";

const CreateBlog = () => {
	const navigate = useNavigate();
	const { state } = useLocation();

	const [title, setTitle] = useState(state?.title ?? "");
	const [content, setContent] = useState(state?.content ?? "");
	const [image, setImage] = useState<File>(state?.image);
	const [loading, setLoading] = useState(false);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const adjustHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "inherit";
			textareaRef.current.style.height = `${
				textareaRef.current.scrollHeight + 20
			}px`;
			textareaRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
		}
	};

	useEffect(() => {
		if (state?.lastRoute === "/preview") {
			setTitle(state?.title);
			setContent(state?.content);
			setImage(state?.image);
			adjustHeight();
		}
	}, [state]);

	const createPost = async () => {
		if (!title) {
			toast("Please enter the title");
			return;
		}
		if (!content) {
			toast("Please enter the content");
			return;
		}
		if (!image) {
			toast("Please select the image");
			return;
		}

		const category = [];
		setLoading(true);
		try {
			const res = await geminiApi({ text: content });
			if (res?.data?.candidates[0].content.parts[0].text) {
				category.push(res?.data?.candidates[0].content.parts[0].text);
			}
			setLoading(false);
		} catch (e) {
			setLoading(false);
			console.log("e", e);
		}

		navigate("/preview", {
			state: {
				id: state?.id,
				title: title,
				content: content,
				image: image,
				category: category,
			},
		});
	};

	return (
		<AuthGuard>
			<>
				<div
					style={{
						minWidth: 1200,
						minHeight: "70vh",
					}}
				>
					<div
						className="create-blog-button-container"
						style={{ margin: "0 0 20px 0" }}
					>
						<h1 style={{ lineHeight: 0, fontSize: 35 }}>Create Blog</h1>
						<div className="create-blog-button-container">
							<div
								className="create-blog-button"
								onClick={() => {
									createPost();
								}}
							>
								Preview
							</div>
							<div
								className="create-blog-button"
								style={{ marginLeft: 10 }}
								onClick={() => {
									setTitle("");
									setContent("");
									adjustHeight();
								}}
							>
								Clear
							</div>
							<label htmlFor="fileInput">
								<div
									className="create-blog-button"
									style={{ marginLeft: 10 }}
									onClick={() => {}}
								>
									<input
										id="fileInput"
										hidden
										type="file"
										onChange={(e) => {
											if (e?.target?.files) {
												setImage(e?.target?.files[0]);
											}
										}}
									/>
									{"Upload"}
								</div>
							</label>
						</div>
					</div>
					{!loading ? (
						<>
							<input
								value={title}
								onChange={(e) => {
									setTitle(e.target.value);
								}}
								placeholder="Enter title "
								className="create-blog-title"
							/>
							<textarea
								ref={textareaRef}
								style={{ overflow: "hidden", resize: "none" }}
								onChange={(e) => {
									setContent(e.target.value);
									adjustHeight();
								}}
								value={content}
								placeholder="Type your thoughts.."
								className="create-blog-content "
							/>
						</>
					) : (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								minWidth: "70vw",
								minHeight: "85vh",
								backgroundColor: "#4a415f",
								borderRadius: 16,
							}}
						>
							<ThreeCircles color={"#6e54b5"} />
							<div style={{ fontSize: 30, margin: "30px 0" }}>
								{"Categorizing your content using gemini AI"}
							</div>
						</div>
					)}
				</div>
			</>
		</AuthGuard>
	);
};

export default CreateBlog;
