import { server } from "@/utils/server";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/Content.module.scss";
import { postTransaction } from "@/api/operations";
import { dollarSign, alert } from "@/utils/someFunc";
import { transferFund } from "@/api/operations";

const getUserWithAccounts = async (id) => {
	// fetch user's data including accounts

	const endpoint = await fetch(`${server}/api/user/handle-accounts/${id}`);
	const getUserAccounts = await endpoint.json();
	return getUserAccounts;
};

function TransferModal({
	acc_name,
	acc_number,
	donorBalance,
	document,
	userId,
	savingAccounts,
	businessAccounts,
	handleComponentReturn,
}) {
	// modal handles
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// user's data
	const [accName, setAccName] = useState("");
	const [amount, setAmount] = useState([]);
	const [reference, setReference] = useState([]);
	const [errorAmount, setErrorAmount] = useState(false);
	const [recipientAccName, setRecipientAccName] = useState("");
	const [recipientAccNum, setRecipientAccNum] = useState("");
	const [recipientAccType, setRecipientAccType] = useState("");
	const [recipientBalance, setRecipientBalance] = useState("");
	const [componentStatus, setComponentStatus] = useState("");
	const [componentMessage, setComponentMessage] = useState("");

	// get recipient data from the name chosed in form to handle transfer
	const handleAccNameChange = (e) => {
		const selectedAccName = e.target.value;
		setAccName(selectedAccName);

		let selectedAccount = savingAccounts.find(
			(acc) => acc.acc_name === selectedAccName
		);

		if (selectedAccount) {
			const { acc_name, acc_number, acc_type, balance } = selectedAccount;
			setRecipientAccName(acc_name);
			setRecipientAccNum(acc_number);
			setRecipientAccType(acc_type);
			setRecipientBalance(balance);
		} else {
			selectedAccount = businessAccounts.find(
				(acc) => acc.business_name === selectedAccName
			);
			if (selectedAccount) {
				const { business_name, acc_number, acc_type, balance } =
					selectedAccount;
				setRecipientAccName(business_name);

				setRecipientAccNum(acc_number);
				setRecipientAccType(acc_type);
				setRecipientBalance(balance);
			} else {
				console.log("This account name is invalid.");
			}
		}
	};

	// handle transfer
	const handleTransfer = async (e) => {
		e.preventDefault();
		const donorNewBalance = donorBalance - amount; //set the new balance for donor
		// set new balance for recipient.
		const recipientNewBalance = parseInt(amount) + parseInt(recipientBalance);

		if (amount < donorBalance) {
			const donorAccType = document;

			transferFund(
				acc_number,
				donorNewBalance,
				donorAccType,
				recipientAccNum,
				parseInt(recipientNewBalance),
				recipientAccType
			).then((data) => {
				if (data.status < 300) {
					// record the transaction
					const transactionType = "Transfer";
					let transactionStatus;

					transactionStatus = "Success";

					// record the donor account transaction
					postTransaction(
						userId,
						acc_name,
						acc_number,
						transactionType,
						`-${amount}`,
						transactionStatus,
						reference,
						donorNewBalance
					).then((transData) => {
						if (transData.status < 300) {
							// record the recipient account transaction
							postTransaction(
								userId,
								recipientAccName,
								recipientAccNum,
								transactionType,
								amount,
								transactionStatus,
								reference,
								recipientNewBalance
							).then((transData) => console.log(transData));
						}
					});

					handleComponentReturn(data.status, data.message); //show success message
				} else {
					transactionStatus = "Failed";
					postTransaction(
						userId,
						acc_name,
						acc_number,
						transactionType,
						amount,
						transactionStatus,
						reference,
						donorNewBalance
					).then((transData) => console.log(transData));

					handleComponentReturn(data.status, data.message); //show error message
				}
			});
		} else {
			setErrorAmount(true);
		}
	};

	return (
		<>
			<Button variant="danger" onClick={handleShow}>
				<i className="bi bi-arrow-left-right"></i> Transfer
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Electronic Fund Transfer</Modal.Title>
				</Modal.Header>
				<div id={styles.modal_transfer_form}>
					<h4 className={styles.current_balance}>
						Balance: <span>{dollarSign(donorBalance)}</span>
					</h4>

					<form className={styles.transfer_form} onSubmit={handleTransfer}>
						<Modal.Body>
							<span className={styles.modal_info}>
								'You can transfer fund from this account to one of your other
								accounts'
							</span>
							<span>
								<label>Choose an account: </label>
								<input
									list="accounts"
									name="account"
									value={accName}
									required
									onChange={handleAccNameChange}
								/>
								<datalist id="accounts">
									{typeof savingAccounts === "object" &&
										savingAccounts.map((account) => (
											<option
												key={account._id}
												value={account.acc_name}
											></option>
										))}

									{typeof businessAccounts === "object" &&
										businessAccounts.map((account) => (
											<option
												key={account._id}
												value={account.business_name}
											></option>
										))}
								</datalist>
							</span>
							<span>
								<label>Amount: </label>
								{errorAmount && alert("danger", "Insufficient fund!")}
								{errorAmount && !errorAmount}
								<input
									type="number"
									min="10"
									max="1000000"
									required
									onChange={(e) => {
										setAmount(e.target.value);
									}}
								/>
							</span>
							<span>
								<label>Reference: </label>
								<input
									type="text"
									onChange={(e) => {
										setReference(e.target.value);
									}}
								/>
							</span>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>
							<Button variant="primary" type="submit">
								Transfer
							</Button>
						</Modal.Footer>
					</form>
				</div>
			</Modal>
		</>
	);
}

export default TransferModal;
