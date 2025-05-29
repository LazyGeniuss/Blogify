import "./Modal.css";

interface IModal {
	title: string;
	showModal: boolean;
	onYesClick: () => void;
	onNoClick: () => void;
}
const Modal = ({ title, showModal, onYesClick, onNoClick }: IModal) => {
	return showModal ? (
		<div className="modal-container">
			<div className="modal">
				<div className="modal-title">{title}</div>
				<div className="modal-button-container">
					<div className="modal-button" onClick={onYesClick}>
						Yes
					</div>
					<div className="modal-button" onClick={onNoClick}>
						No
					</div>
				</div>
			</div>
		</div>
	) : (
		<></>
	);
};

export default Modal;
