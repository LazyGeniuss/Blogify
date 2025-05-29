import "./Home.css";
import { useNavigate } from "react-router";
import { Card1, Card2 } from "../../components/card/Card";
import NavLayout from "../../layout/NavLayout";
import { useCallback, useEffect, useState } from "react";
import { home } from "../../services/api";
import { toast } from "react-toastify";
import { ThreeCircles } from "react-loader-spinner";

export interface IBlog {
	_id: string;
	email: string;
	likes: string[];
	title: string;
	content: string;
	image: string;
	date: string;
	category: string[];
	isDeleted: boolean;
}

const Home = () => {
	const navigate = useNavigate();

	const [homeData, setHomeData] = useState<IBlog[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchHomePageData = async () => {
		try {
			setLoading(true);
			const res = await home();
			setHomeData(res?.data?.data);
			setLoading(false);
		} catch (e: any) {
			toast(e?.res?.data?.message);
			console.log("e", e);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!loading) {
			fetchHomePageData();
		}
	}, []);

	const renderItem1 = useCallback((item: IBlog) => {
		return (
			<Card1
				title={item?.title}
				content={item?.content}
				key={item?._id}
				id={item?._id}
				date={item?.date}
				onClick={() => {
					navigate(`/blog/${item?._id}`);
				}}
			/>
		);
	}, []);

	const renderItem2 = useCallback((item: IBlog) => {
		return (
			<Card2
				title={item?.title}
				content={item?.content}
				key={item?._id}
				id={item?._id}
				date={item?.date}
				onClick={() => {
					navigate(`/blog/${item?._id}`);
				}}
			/>
		);
	}, []);

	return (
		<NavLayout>
			<div className="home-container">
				<h1 className="home-title">{"Blog Home Page"}</h1>
				<div className="home-content-container">
					{homeData?.length > 0 ? (
						<>
							<div style={{ marginRight: 50 }}>{homeData.map(renderItem1)}</div>
							<div>{homeData.map(renderItem2)}</div>
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
		</NavLayout>
	);
};

export default Home;
