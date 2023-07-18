import { useState } from "react";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/Content.module.scss";
import { postTransaction } from "@/api/operations";

// toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dollarSign, toastSuccess, toastError, alert } from "@/utils/someFunc";

function DepositModal({ acc_name, acc_number, balance, document, userId }) {
	// modal handles
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// user's data
	const [deposit, setDeposit] = useState();
	const [description, setDescription] = useState();

	const router = useRouter();
	// router to refresh the page on demand

	const refreshPage = () => {
		router.push(router.asPath);
	};

	// handle deposit
	const handleDeposit = async (e) => {
		e.preventDefault();

		//Get the new balance then save the deposit

		const newBalance = parseInt(balance) + parseInt(deposit);
		const jsonData = JSON.stringify({
			acc_number: acc_number,
			balance: newBalance,
			field: "balance",
		});

		const endpoint =
			document === "user_doc"
				? "../api/user"
				: document === "business_doc"
				? "../api/business-account"
				: "../api/saving-account";

		const options = {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: jsonData,
		};
		const makeDeposit = await fetch(endpoint, options);
		const res = await makeDeposit.json();

		// record the transaction
		const transactionType = "Deposit";
		let status;

		if (res.status == 201) {
			status = "Success";
			postTransaction(
				userId,
				acc_name,
				acc_number,
				transactionType,
				deposit,
				status,
				description,
				newBalance
			).then((data) => console.log(data));

			refreshPage();
			toastSuccess(res.message); // show success message
		} else {
			status = "Failed";
			postTransaction(
				userId,
				acc_name,
				acc_number,
				transactionType,
				deposit,
				status,
				description,
				newBalance
			).then((data) => console.log(data));

			toastError(res.message); //show error message
		}
	};

	return (
		<>
			<Button variant="success" size="sm" onClick={handleShow}>
				<i className="bi bi-box-arrow-in-down-right"></i> Deposit
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Deposit</Modal.Title>
				</Modal.Header>
				<div id={styles.modal_deposit_form}>
					<h4 className={styles.current_balance}>
						Balance: $<span>{balance}</span>
					</h4>

					<form className={styles.deposit_form} onSubmit={handleDeposit}>
						<Modal.Body>
							<span>
								<label>Amount: </label>
								<input
									type="number"
									min="10"
									max="1000000"
									required
									onChange={(e) => {
										setDeposit(e.target.value);
									}}
								/>
							</span>
							<span>
								<label>Reference: </label>
								<input
									type="text"
									onChange={(e) => {
										setDescription(e.target.value);
									}}
								/>
							</span>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>
							<Button variant="primary" type="submit">
								Deposit
							</Button>
						</Modal.Footer>
					</form>
				</div>
			</Modal>
		</>
	);
}

export default DepositModal;
