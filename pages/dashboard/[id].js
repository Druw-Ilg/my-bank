import { useState, useReducer, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
// bootstrap components
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

import { server } from "@/utils/server";
import { dollarSign, toastSuccess, toastError, alert } from "@/utils/someFunc";

// toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
	getBusinesses,
	postBusinessAcc,
	getSavingAcc,
	postSavingAcc,
} from "@/api/operations";

import styles from "@/styles/Content.module.scss";
import Heads from "@/components/Heads";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BusinessAccList from "@/components/BusinessAccList";
import SavingAccList from "@/components/SavingAccList";

const addAccFormReducer = (state, event) => {
	return {
		...state,
		[event.target.name]: event.target.value,
	};
};

const dashboard = ({ user }) => {
	const [addAccData, setAddAccData] = useReducer(addAccFormReducer, {});
	const [errorMessage, setErrorMessage] = useState("");
	const [businessAccounts, setBusinessAccounts] = useState([]);
	const [savingAccounts, setSavingAccounts] = useState([]);

	const [showAccForm, setAcc] = useState(false);
	const closeAccForm = () => setAcc(false);
	const accForm = () => setAcc(true);

	const router = useRouter();
	// router to refresh the page on demand

	const loadDashboard = (id) => {
		const userId = id.toString();
		router.push(`${server}/dashboard/${user._id}`);
	};

	const [accDesignation, setDesignation] = useState("");
	const [accDescription, setDescription] = useState("");

	// fetch business & saving accounts

	async function fetchBusinesses() {
		if (user.business_acc) {
			getBusinesses(user._id).then((data) => setBusinessAccounts(data));
		}
	}

	async function fetchSavingAcc() {
		if (user.saving_acc) {
			getSavingAcc(user._id).then((data) => setSavingAccounts(data));
		}
	}
	useEffect(() => {
		/*
		 * render business accounts
		 * information if they exist
		 */

		fetchBusinesses();

		/*
		 * render saving accounts
		 * information if they exist
		 */

		fetchSavingAcc();
	}, []);

	// function to add an account
	const addAccountForm = (e) => {
		e.preventDefault();

		if (addAccData.acc_type === "Business Account") {
			postBusinessAcc(addAccData, user._id, user.business_acc).then((data) => {
				if (data.status === 201) {
					toastSuccess(data.message);
					fetchBusinesses();
				} else {
					toastError(data.message);
				}
			});
		} else if (addAccData.acc_type === "Saving Account") {
			postSavingAcc(addAccData, user._id, user.saving_acc).then((data) => {
				if (data.status === 201) {
					fetchSavingAcc();
					toastSuccess(data.message);
				} else {
					toastError(data.message);
				}
			});
		}
	};

	// change label background on click
	const changeLabelBg1 = () => {
		document.getElementById("adddAccFormLabel2").style.backgroundColor =
			"#d3d3d3";
		document.getElementById("adddAccFormLabel1").style.backgroundColor =
			"#F3F3F3";
		setDesignation("Business");
		setDescription("Enter the Business name");
	};
	const changeLabelBg2 = () => {
		document.getElementById("adddAccFormLabel1").style.backgroundColor =
			"#d3d3d3";
		document.getElementById("adddAccFormLabel2").style.backgroundColor =
			"#F3F3F3";
		setDesignation("Account");
		setDescription("Enter the account name");
	};

	return (
		<>
			<Heads />
			<Header page={"Dashboard"} />

			<div className={styles.main}>
				<h2>Welcome {user.firstName}</h2>
				<div className={styles.container}>
					<Button variant="primary" onClick={accForm}>
						Add an account
					</Button>

					<div className={styles.accountsOverview}>
						<Accordion defaultActiveKey="0">
							<Accordion.Item eventKey="0">
								<Accordion.Header>Check Account</Accordion.Header>
								<Accordion.Body>
									<div className="container">
										<table className="table table-striped table-hover table-responsive">
											<tbody>
												<tr>
													<th scope="row">Name</th>
													<td>
														{user.firstName} {user.lastName}
													</td>
												</tr>
												<tr>
													<th scope="row">Account Type</th>
													<td>Check</td>
												</tr>
												<tr>
													<th scope="row">Account Number</th>
													<td>{user.acc_num}</td>
												</tr>
												<tr>
													<th scope="row">Balance</th>
													<td>{dollarSign(user.balance)}</td>
												</tr>
												<tr>
													<th scope="row">Date Creation</th>
													<td>{user.created}</td>
												</tr>
											</tbody>
										</table>
									</div>
									<div className={styles.accounts_transaction_btn}>
										<Button variant="success">
											<i className="bi bi-box-arrow-in-down-right"></i> Deposit
										</Button>
										<Button variant="danger">
											<i className="bi bi-arrow-left-right"></i> Transfer
										</Button>
										<Button variant="warning">
											<i className="bi bi-box-arrow-up-right"></i> Withdraw
										</Button>
									</div>
								</Accordion.Body>
							</Accordion.Item>

							{user.business_acc && (
								<BusinessAccList accounts={businessAccounts} />
							)}
							{user.saving_acc && <SavingAccList accounts={savingAccounts} />}
						</Accordion>
					</div>
					<div className={styles.grid}>
						<a
							href={"../account/" + user._id.toString()}
							className={styles.dashboard_item}
						>
							Bank Account
							<i className="bi bi-cash-stack"></i>
						</a>

						<a
							href={"../transactions/" + user._id.toString()}
							className={styles.dashboard_item}
						>
							Transactions
							<i className="bi bi-arrow-down-up"></i>
						</a>
						<a
							href={"../services/" + user._id.toString()}
							className={styles.dashboard_item}
						>
							Other Services
							<i className="bi bi-grid-3x3-gap-fill"></i>
						</a>

						<a
							href={"../profile/" + user._id.toString()}
							className={styles.dashboard_item}
						>
							My Profile
							<i className="bi bi-person-rolodex"></i>
						</a>
					</div>
				</div>
			</div>
			<Footer />

			{/* hidden sidebars for form to add an account*/}

			<Offcanvas show={showAccForm} onHide={closeAccForm}>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>Add an account</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<form className={styles.addAccountForm} onSubmit={addAccountForm}>
						<div className={styles.addAccountForm_opts}>
							<span className={styles.addAccountForm_input}>
								<input
									type="radio"
									name="acc_type"
									id="addBusinessAcc"
									value="Business Account"
									onChange={setAddAccData}
								/>
								<label
									id="adddAccFormLabel1"
									htmlFor="addBusinessAcc"
									onClick={changeLabelBg1}
								>
									Business Account
								</label>
							</span>
							<span className={styles.addAccountForm_input}>
								<input
									type="radio"
									name="acc_type"
									id="addSavingAcc"
									value="Saving Account"
									onChange={setAddAccData}
								/>
								<label
									id="adddAccFormLabel2"
									htmlFor="addSavingAcc"
									onClick={changeLabelBg2}
								>
									Saving Account
								</label>
							</span>
						</div>
						<div className={styles.addAccountForm_input}>
							<label htmlFor="accName">{accDesignation} Name:</label>
							<h6>{accDescription}</h6>
							<input
								type="text"
								id="accName"
								name="accName"
								onChange={setAddAccData}
							/>
						</div>
						<Button variant="primary" type="submit">
							Add an account
						</Button>
					</form>
				</Offcanvas.Body>
			</Offcanvas>
			<ToastContainer />
		</>
	);
};

export const getStaticPaths = async () => {
	// fetch users list
	const res = await fetch(`${server}/api/user`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const users = await res.json();

	// get the paths we want to prerender based on users
	const paths = users.map((user) => {
		return {
			params: { id: user._id.toString() },
		};
	});
	return {
		paths,
		fallback: false,
	};
};

export const getStaticProps = async ({ params }) => {
	// fetch user's data
	const res = await fetch(`${server}/api/user/${params.id}`);
	const user = await res.json();

	return {
		props: { user },
	};
};

export default dashboard;
