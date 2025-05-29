import "./Explore.css";
import NavLayout from "../../layout/NavLayout";
import { Card3 } from "../../components/card/Card";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { explore } from "../../services/api";
import { IBlog } from "../home/Home";
import { ThreeCircles } from "react-loader-spinner";

interface IExploreData {
	_id: string;
	blogs: IBlog[];
}

const Explore = () => {
	const navigate = useNavigate();

	const [exploreData, setExploreData] = useState<IExploreData[]>([]);

	const fetchExploreData = async () => {
		try {
			const res = await explore();
			setExploreData(res?.data?.data);
		} catch (e: any) {
			toast(e?.data?.message);
		}
	};

	useEffect(() => {
		fetchExploreData();
	}, []);

	return (
		<NavLayout>
			<div className="explore-container">
				{exploreData && exploreData.length > 0 ? (
					exploreData.map((exploreItem) => {
						return (
							<>
								<h4 className="explore-title">{exploreItem?._id}</h4>
								<div className="explore-grid-view">
									{exploreItem?.blogs?.map((item) => {
										return (
											<Card3
												style={{ margin: "0 20px" }}
												content={item?.content}
												date={item?.date}
												id={item._id}
												title={item?.title}
												onClick={() => {
													navigate(`/blog/${item._id}`);
												}}
											/>
										);
									})}
								</div>
							</>
						);
					})
				) : (
					<div
						style={{
							flex: 1,
							minHeight: "70vh",
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

export default Explore;
