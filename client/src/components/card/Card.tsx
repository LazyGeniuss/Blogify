import moment from "moment";
import { CSSProperties } from "react";
import { Images } from "../../assets";
import { BASE_URL } from "../../utils/constants";
import "./Card.css";

interface ICard {
	id: string;
	title: string;
	content: string;
	date: string;
	onClick: () => void;
	allowChange?: boolean;
	onDeleteClick?: () => void;
	onEditClick?: () => void;
	style?: CSSProperties;
}

export const Card1 = ({ title, onClick, content, date, id }: ICard) => {
	// const [image, setImage] = useState();
	// const getImage = async () => {
	// 	const res = await instance.get(`${BASE_URL}blog/image/${id}`);
	// 	setImage(res.data);
	// 	return res;
	// };

	// useEffect(() => {
	// 	getImage();
	// }, [id]);

	return (
		<div className="card1-container" onClick={onClick}>
			<img src={`${BASE_URL}blog/image/${id}`} className="card1-image" />
			<p>{moment(date).fromNow()}</p>
			<p className="card1-title">{title}</p>

			<p className="card1-content">
				{content.split(" ").slice(0, 100).toString().replaceAll(",", " ")}
			</p>
		</div>
	);
};

export const Card2 = ({ onClick, date, title, id }: ICard) => {
	// const getImage = async () => {
	// 	const res = await instance.get(`${BASE_URL}blog/image/${id}`);
	// 	return res;
	// };
	return (
		<div className="card2-container" onClick={onClick}>
			<img src={`${BASE_URL}blog/image/${id}`} className="card2-image" />
			<div className="card2-content-container">
				<p>{moment(date).fromNow()}</p>
				<p className="card2-content">{title}</p>
			</div>
		</div>
	);
};

export const Card3 = ({
	onClick,
	content,
	date,
	title,
	id,
	allowChange,
	onDeleteClick,
	onEditClick,
	style,
}: ICard) => {
	// const getImage = async () => {
	// 	const res = await instance.get(`${BASE_URL}blog/image/${id}`);
	// 	return res;
	// };
	return (
		<div className="card3-container" onClick={onClick} style={style}>
			<img src={`${BASE_URL}blog/image/${id}`} className="card3-img" />
			<p>{moment(date).fromNow()}</p>
			<p className="card3-title">{title}</p>
			<p className="card3-content">
				{content.split(" ").slice(0, 50).toString().replaceAll(",", " ") +
					"..."}
			</p>
			{allowChange ? (
				<div className="card3-flex">
					<div
						onClick={(e) => {
							e.stopPropagation();
							if (onEditClick) onEditClick();
						}}
					>
						<img src={Images.edit} className="card3-icon" />
					</div>
					<div
						onClick={(e) => {
							e.stopPropagation();
							if (onDeleteClick) onDeleteClick();
						}}
						className="card3-margin-left"
					>
						<img src={Images.delete} className="card3-icon" />
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};
