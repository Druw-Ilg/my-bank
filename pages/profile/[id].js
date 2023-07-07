import { useState, useReducer, useEffect } from "react";
import { useRouter } from "next/router";

import styles from "@/styles/Content.module.scss";

import Accordion from "react-bootstrap/Accordion";
import { useAccordionButton } from "react-bootstrap/AccordionButton";

import Card from "react-bootstrap/Card";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { toastSuccess, toastError, alert } from "@/utils/someFunc";

import { server } from "@/utils/server";
import Heads from "@/components/Heads";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProBssAcc from "@/components/ProBssAcc";
import ProSvgAcc from "@/components/ProSvgAcc";

import { getBusinesses, getSavingAcc } from "@/api/operations";

// collect form data
const formReducer = (state, event) => {
	return {
		...state,
		[event.target.name]: event.target.value,
	};
};

//return a button that toggle the form to change password
function CustomToggle({ children, eventKey }) {
	const decoratedOnClick = useAccordionButton(eventKey, () => {});

	return (
		<button
			type="button"
			className={styles.changePassBtn}
			onClick={decoratedOnClick}
		>
			{children}
		</button>
	);
}

const profile = ({ user }) => {
	const [formData, setFormData] = useReducer(formReducer, {});
	const [businessAccounts, setBusinessAccounts] = useState([]);
	const [savingAccounts, setSavingAccounts] = useState([]);
	const [actionFromChild, setActionFromChild] = useState();
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [errorNewPass, setErrorNewPass] = useState("");
	const router = useRouter();

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

	// handle password change action
	const handlePasswordSubmit = async (e) => {
		e.preventDefault();

		// check that new password macthes confirmation password
		if (formData.newPassword !== formData.confirm_password) {
			setSuccessMessage("");
			setErrorMessage("");
			setErrorNewPass("Passwords do not match!");
		} else if (Object.keys(formData).length == 0) {
			setSuccessMessage("");
			setErrorNewPass("");
			setErrorMessage("Empty form data");
		} else {
			const endpoint = `${server}/api/user/changePassword/${user._id}`;
			const jsonData = JSON.stringify(formData);
			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: jsonData,
			};

			const changePassword = await fetch(endpoint, options);
			const res = await changePassword.json();
			if (res.status >= 400) {
				setErrorNewPass("");
				setSuccessMessage("");
				setErrorMessage(res.message);
			} else {
				setErrorNewPass("");
				setErrorMessage("");
				setSuccessMessage(res.message);
			}
		}
	};

	// generate an alert meassage if there is
	// no business or saving account to display

	const isAcc = () => {
		if (!user.business_acc && !user.saving_acc) {
			const variant = "danger";
			const message = "No accounts available.";
			return <tr Collapse="5"> alert(variant, message)</tr>;
		}
	};

	// callback function to receive data from child component
	const handleActionFromChild = (data) => {
		// setActionFromChild(data);
		if (data.action === "delete account") {
			if (data.status === 200) {
				fetchBusinesses();
				fetchSavingAcc();
				toastSuccess(data.message);
			} else {
				toastError(data.message);
			}
		}
	};

	return (
		<>
			<Heads />
			<Header page={"My Profile"} />

			<nav aria-label="breadcrumb" className={styles.nav_breadcrumb}>
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a href={"/dashboard/" + user._id.toString()}>Dashboard</a>
					</li>
					<li className="breadcrumb-item active" aria-current="page">
						profile
					</li>
				</ol>
			</nav>

			<div className={styles.main}>
				<div className={styles.container}>
					<div className={styles.grid}>
						<div className={styles.profileInfo}>
							<div className={styles.profileParams}>
								<Card>
									<Card.Header>Your Accounts</Card.Header>
									<Card.Body>
										<table className="table table-striped table-hover table-responsive">
											<tbody>
												<tr>
													<th scope="col">Account Type</th>
													<th scope="col">Name</th>
													<th scope="col">Balance</th>
													<th scope="col">Date Creation</th>
													<th scope="col">Actions</th>
												</tr>
												{isAcc()}
												{businessAccounts.map((account) => (
													<ProBssAcc
														key={account._id}
														account={account}
														onDatataGenerated={handleActionFromChild}
													/>
												))}
												{savingAccounts.map((account) => (
													<ProSvgAcc
														key={account._id}
														account={account}
														onDatataGenerated={handleActionFromChild}
													/>
												))}
											</tbody>
										</table>
									</Card.Body>
								</Card>
							</div>
							<div className={styles.profileField}>
								<span>
									<label htmlFor="firstName">First Name: </label>

									<input
										type="text"
										id="firstName"
										name="firstName"
										disabled
										placeholder={user.firstName}
									/>
								</span>
								<span>
									<label htmlFor="lastName">last Name: </label>
									<input
										type="text"
										id="lastName"
										name="lastName"
										disabled
										placeholder={user.lastName}
									/>
								</span>
							</div>
							<Accordion>
								<Accordion.Collapse eventKey="0">
									<Card>
										<Card.Header>Change Your Password</Card.Header>
										<Card.Body>
											<form onSubmit={handlePasswordSubmit}>
												<p className={styles.successMessage}>
													{successMessage}
												</p>
												<p className={styles.errorMessage}>{errorMessage}</p>
												<div className={styles.profileField}>
													<span>
														<label htmlFor="password">Password:</label>

														<input
															type="password"
															placeholder="*******"
															name="password"
															id="password"
															required
															onChange={setFormData}
														/>
													</span>
												</div>
												<div className={styles.profileField}>
													<span>
														<label htmlFor="newPassword">New Password:</label>
														<input
															type="password"
															placeholder="********"
															name="newPassword"
															id="newPassword"
															required
															onChange={setFormData}
														/>
													</span>
													<span>
														<label htmlFor="confirm_password">
															Confirm New Password:
														</label>
														<input
															type="password"
															placeholder="*******"
															name="confirm_password"
															id="confirm_password"
															required
															onChange={setFormData}
														/>
													</span>
												</div>
												<p className={styles.errorMessage}>{errorNewPass}</p>
												<button className={styles.changePassBtn}>Submit</button>
											</form>
										</Card.Body>
									</Card>
								</Accordion.Collapse>
								<CustomToggle eventKey="0">
									Change your Password <i className="bi bi-pencil-square"></i>
								</CustomToggle>
							</Accordion>
						</div>
					</div>
				</div>
			</div>
			<Footer />
			<ToastContainer />
		</>
	);
};

export default profile;

// Fetch user's data from  api

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
