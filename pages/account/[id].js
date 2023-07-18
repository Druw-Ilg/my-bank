import { useState, useReducer } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { server } from "@/utils/server";
import { mortgageCalcul } from "@/utils/mortgage-calcul";
import Heads from "@/components/Heads";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/Content.module.scss";

const mortgageReducer = (state, event) => {
	return {
		...state,
		[event.target.name]: event.target.value,
	};
};

const account = ({ user }) => {
	const [mortgageData, setMortgageData] = useReducer(mortgageReducer, {});
	const [mortgage, setMortgage] = useState();

	// calculate mortgage
	const calculateMortgage = (e) => {
		e.preventDefault();

		const mortgage = mortgageCalcul(
			parseInt(mortgageData.principal),
			parseInt(mortgageData.annualInterestRate),
			parseInt(mortgageData.period)
		);
		const MORTGAGE_IN_USD = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(mortgage);
		setMortgage("Your mortgage is: " + MORTGAGE_IN_USD);
	};

	return (
		<>
			<Heads />
			<Header page={"Bank Account"} />

			<nav aria-label="breadcrumb" className={styles.nav_breadcrumb}>
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a href={"/dashboard/" + user._id.toString()}>Dashboard</a>
					</li>
					<li className="breadcrumb-item active" aria-current="page">
						bank account
					</li>
				</ol>
			</nav>

			<div className={styles.main}>
				<div className={styles.container}>
					<div className={styles.grid}>
						<div className={styles.account}>
							<div className={styles.loans}>
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
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default account;

// Fetch data from users api

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
