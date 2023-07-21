import { useState, useReducer } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Table from "react-bootstrap/Table";
import { server } from "@/utils/server";
import { mortgageCalcul } from "@/utils/mortgage-calcul";
import Heads from "@/components/Heads";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/Content.module.scss";
import Payments from "@/components/Payments";
import { alert } from "@/utils/someFunc";

// Mortgage Calculator will be implemented later on

// const mortgageReducer = (state, event) => {
// 	return {
// 		...state,
// 		[event.target.name]: event.target.value,
// 	};
// };

const payments = ({ user, payments }) => {
	// const [mortgageData, setMortgageData] = useReducer(mortgageReducer, {});
	// const [mortgage, setMortgage] = useState();

	// calculate mortgage
	// const calculateMortgage = (e) => {
	// 	e.preventDefault();

	// 	const mortgage = mortgageCalcul(
	// 		parseInt(mortgageData.principal),
	// 		parseInt(mortgageData.annualInterestRate),
	// 		parseInt(mortgageData.period)
	// 	);
	// 	const MORTGAGE_IN_USD = new Intl.NumberFormat("en-US", {
	// 		style: "currency",
	// 		currency: "USD",
	// 	}).format(mortgage);
	// 	setMortgage("Your mortgage is: " + MORTGAGE_IN_USD);
	// };

	return (
		<>
			<Heads />
			<Header page={"Payments"} />

			<nav aria-label="breadcrumb" className={styles.nav_breadcrumb}>
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a
							href={"/dashboard/" + user._id.toString()}
							id={styles.breadcrumb_item_before}
						>
							Dashboard
						</a>
					</li>
					<li
						className="breadcrumb-item active"
						id={styles.breadcrumb_item}
						aria-current="page"
					>
						Payments
					</li>
				</ol>
			</nav>

			<div className={styles.main}>
				<div className={styles.container}>
					<div className={styles.grid}>
						<div className={styles.payments}>
							{payments.length < 1 ? (
								alert("danger", "No payments available for the moment.")
							) : (
								<Table striped responsive hover>
									<thead>
										<tr>
											<th>From:</th>
											<th>Amount</th>
											<th>Beneficiary</th>
											<th>Status</th>
											<th>Reference</th>
											<th>Date</th>
										</tr>
									</thead>
									<tbody>
										<Payments payments={payments} />
									</tbody>
								</Table>
							)}
							{/* <div className={styles.loans}>
								<h3>Loans &amp; Mortgage</h3>
								<h5>
									Thinking about buying a new home? No problem, we’re here to
									help.
								</h5>
								<p>Calculate your mortgage</p>
								<form
									className={styles.new_balance_form}
									onSubmit={calculateMortgage}
								>
									<span>
										<label>Principal: </label>
										<input
											type="number"
											name="principal"
											min="1000"
											max="1000000"
											required
											onChange={setMortgageData}
										/>
									</span>
									<span>
										<label>Annual interest rate: </label>
										<input
											type="number"
											step="0.01"
											name="annualInterestRate"
											min="1"
											max="30"
											required
											onChange={setMortgageData}
										/>
									</span>
									<span>
										<label>Period (Years): </label>
										<input
											type="number"
											name="period"
											min="1"
											max="30"
											required
											onChange={setMortgageData}
										/>
									</span>
									<p className={styles.mortgage}>{mortgage}</p>
									<button>Calculate</button>
								</form>
							</div> */}
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default payments;

// Fetch data from user and payments api

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

	const paymentsReq = await fetch(`${server}/api/payments/${params.id}`);
	const payments = await paymentsReq.json();
	return {
		props: { user, payments },
	};
};
