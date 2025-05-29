import "./CreateBlog.css";
import AuthGuard from "../../layout/AuthGuard";
import NavLayout from "../../layout/NavLayout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";

const CreateBlog = () => {
	const navigate = useNavigate();
	const { state } = useLocation();

	const [title, setTitle] = useState(state?.title ?? "");
	const [content, setContent] = useState(state?.content ?? "");
	const [image, setImage] = useState<File>(state?.image);

	useEffect(() => {
		if (state?.lastRoute === "/preview") {
			setTitle(state?.title);
			setContent(state?.content);
			setImage(state?.image);
		}
	}, [state]);

	const createPost = () => {
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

		const cat = [];
		if (content.includes("#")) {
			const temp = content.split("#");

			if (temp.length > 1) {
				for (let i = 1; i < temp.length; i++) {
					cat.push(temp[i].split(" ")[0]);
				}
			}
		}

		navigate("/preview", {
			state: {
				id: state?.id,
				title: title,
				content: content,
				image: image,
				category: cat,
			},
		});
	};

	return (
		<AuthGuard>
			<NavLayout>
				<div style={{ minWidth: 1200 }}>
					<input
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
						}}
						placeholder="Enter title "
						className="create-blog-title"
					/>
					<textarea
						onChange={(e) => setContent(e.target.value)}
						value={content}
						placeholder="Type your thoughts.."
						className="create-blog-content "
					/>
					<div>
						{
							"*note - use hashtag in the end of content to add it to specific category. for example - #travel"
						}
					</div>
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
			</NavLayout>
		</AuthGuard>
	);
};

export default CreateBlog;
