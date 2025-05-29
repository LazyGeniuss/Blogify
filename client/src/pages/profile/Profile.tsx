import "./Profile.css";
import NavLayout from "../../layout/NavLayout";
import AuthGuard from "../../layout/AuthGuard";
import { Card3 } from "../../components/card/Card";
import { useEffect, useState } from "react";
import { deleteBlog, getProfile } from "../../services/api";
import { IBlog } from "../home/Home";
import { useNavigate } from "react-router";
import Modal from "../../components/modal/Modal";
import { toast } from "react-toastify";
import { ThreeCircles } from "react-loader-spinner";

const Profile = () => {
	const navigate = useNavigate();

	const [userData, setUserData] = useState<any>();
	const [blogs, setBlogs] = useState<IBlog[]>([]);
	const [likedBlogs, setLikeBlogs] = useState<IBlog[]>([]);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleteId, setDeleteId] = useState<string>();
	const [loading, setLoading] = useState(false);

	const getProfileData = async () => {
		try {
			setLoading(true);
			const res = await getProfile();
			setLoading(false);
			setUserData(res.data.data.user);
			setBlogs(res.data.data.blogs);
			setLikeBlogs(res.data.data.likedBlogs);
		} catch (e: any) {
			toast(e?.response?.data?.message ?? "Something went wrong");
			setLoading(false);
		}
	};

	const deleteUserBlog = async () => {
		try {
			setBlogs((prev) => prev?.filter((item) => item?._id != deleteId));
			const res = await deleteBlog({ id: deleteId! });
			toast(res?.data?.message);
		} catch (e: any) {
			console.log("e", e);
			toast(e?.response?.data?.message ?? "Somwthing went wrong");
		}
	};

	useEffect(() => {
		getProfileData();
	}, []);

	return (
		<AuthGuard>
			<NavLayout>
				<div className="profile-container">
					<div className="profile-user-detail ">
						{`${userData?.firstName ?? ""} ${userData?.lastName ?? ""}`}
					</div>
					{!loading ? (
						<>
							<div className="profile-title">{"Your Blogs"}</div>
							<div className="profile-grid-view">
								{blogs &&
									blogs.map((item) => {
										return (
											<Card3
												style={{ margin: "0 20px" }}
												key={item?._id}
												id={item?._id}
												content={item?.content}
												date={item?.date}
												title={item?.title}
												allowChange={true}
												onClick={() => navigate(`/blog/${item?._id}`)}
												onEditClick={() =>
													navigate("/create", {
														state: {
															id: item?._id,
															title: item?.title,
															content: item?.content,
															image: item?.image,
															category: item?.category,
														},
													})
												}
												onDeleteClick={() => {
													setDeleteId(item?._id);
													setShowDeleteModal(true);
												}}
											/>
										);
									})}
							</div>
							<div className="profile-title">{"Blogs Liked by You"}</div>
							<div className="profile-grid-view">
								{likedBlogs &&
									likedBlogs.map((item) => {
										return (
											<Card3
												style={{ margin: "0 20px" }}
												key={item?._id}
												id={item?._id}
												content={item?.content}
												date={item?.date}
												title={item?.title}
												onClick={() => navigate(`/blog/${item?._id}`)}
											/>
										);
									})}
							</div>
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
				<Modal
					showModal={showDeleteModal}
					title={"Are you sure you want delete this blog?"}
					onYesClick={() => {
						deleteUserBlog();
						setShowDeleteModal(false);
					}}
					onNoClick={() => {
						setShowDeleteModal(false);
					}}
				/>
			</NavLayout>
		</AuthGuard>
	);
};

export default Profile;
