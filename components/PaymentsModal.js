import { useState, useReducer } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/Content.module.scss";
import { dollarSign, alert } from "@/utils/someFunc";
import { postPayment, payment } from "@/api/operations";

// form reducer for payment form. It gathers all form data
const paymentDataFormReducer = (state, event) => {
	return {
		...state,
		[event.target.name]: event.target.value,
	};
};

function PaymentsModal({
	acc_name,
	acc_number,
	balance,
	document,
	userId,
	handleComponentReturn,
}) {
	// modal events
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	// save form data
	const [paymentData, setPaymentData] = useReducer(paymentDataFormReducer, {});
	const [errorAmount, setErrorAmount] = useState(false);

	const handlePayment = (e) => {
		e.preventDefault();

		// Check if the amount to pay is less than the balance then proceed
		if (paymentData.amount < balance) {
			const payerBalance = parseInt(balance) - parseInt(paymentData.amount);
			const payerId = userId;

			payment(
				acc_number,
				payerBalance,
				paymentData.accountNumber,
				paymentData.amount,
				paymentData.reference,
				document
			).then((data) => {
				let transactionStatus;

				if (data && data.status < 300) {
					// record the transaction
					const beneficiary_id = data.beneficiary_id;

					transactionStatus = "Success";

					// record the successfull payment.
					postPayment(
						payerId,
						acc_name,
						beneficiary_id,
						paymentData.name,
						paymentData.amount,
						transactionStatus,
						paymentData.reference
					);
					handleComponentReturn(data.status, "Successfull payment"); //show success message
				} else {
					transactionStatus = "Failed";
					const beneficiary_id = null;

					// record the failed payment.
					postPayment(
						payerId,
						acc_name,
						beneficiary_id,
						paymentData.name,
						paymentData.amount,
						transactionStatus,
						paymentData.reference
					);
					handleComponentReturn(data.status, "Payment Failed"); //show Error message
				}
			});
		} else {
			setErrorAmount(true);
		}
		// console.log();
	};

	return (
		<>
			<Button variant="warning" onClick={handleShow}>
				<i className="bi bi-box-arrow-up-right"></i> Payments
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Payments</Modal.Title>
				</Modal.Header>
				<div id={styles.modal_payments_form}>
					<h4 className={styles.current_balance}>
						Balance: <span>{dollarSign(balance)}</span>
					</h4>

					<form className={styles.payments_form} onSubmit={handlePayment}>
						<Modal.Body>
							<span>
								<label>Name: </label>
								<input
									type="text"
									name="name"
									placeholder="Beneficiary name"
									required
									onChange={setPaymentData}
								/>
							</span>
							<span>
								<label>Account Number: </label>
								<input
									type="text"
									name="accountNumber"
									placeholder="Beneficiary account number"
									required
									onChange={setPaymentData}
								/>
							</span>
							<span>
								<label>Amount: </label>
								{errorAmount && alert("danger", "Insufficient fund!")}
								{errorAmount && !errorAmount}
								<input
									type="number"
									name="amount"
									min="10"
									max="1000000"
									required
									onChange={setPaymentData}
								/>
							</span>
							<span>
								<label>Reference: </label>
								<input type="text" name="reference" onChange={setPaymentData} />
							</span>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>
							<Button variant="primary" type="submit">
								Pay
							</Button>
						</Modal.Footer>
					</form>
				</div>
			</Modal>
		</>
	);
}

export default PaymentsModal;
