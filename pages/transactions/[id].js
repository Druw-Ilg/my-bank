import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

import { server } from "@/utils/server";
import Link from "next/link";
import Heads from "@/components/Heads";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Transactions from "@/components/Transactions";
import styles from "@/styles/Content.module.scss";
import { getTransactions } from "@/api/operations";
import { dollarSign, alert } from "@/utils/someFunc";

const transactions = ({ user }) => {
	const [transactions, setTransactions] = useState([]);

	let transactionsList = [];

	// will store error message if there is no transactions
	const [noTransactions, setNoTransactions] = useState("");

	useEffect(() => {
		getTransactions(user._id).then((res) => {
			if (res.status === 200) {
				setTransactions(res.data);
				// setTransactions(res);
			} else {
				setNoTransactions(res.message);
			}
		});
	}, []);

	return (
		<>
			<Heads />
			<Header page={"Your Transactions"} />

			<nav aria-label="breadcrumb" className={styles.nav_breadcrumb}>
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a href={"/dashboard/" + user._id.toString()}>Dashboard</a>
					</li>
					<li className="breadcrumb-item active" aria-current="page">
						Transactions
					</li>
				</ol>
			</nav>

			<div className={styles.main}>
				<div className={styles.container}>
					<div className={styles.grid}>
						<div className={styles.transactions}>
							{transactions.length < 1 ? (
								alert("danger", noTransactions)
							) : (
								<Table striped responsive hover>
									<thead>
										<tr>
											<th>Account Name</th>
											<th>Account Number</th>
											<th>Account Type</th>
											<th>Amount</th>
											<th>Status</th>
											<th>Description</th>
											<th>Date</th>
											<th>balance</th>
										</tr>
									</thead>
									<tbody>
										<Transactions transactions={transactions} />
									</tbody>
								</Table>
							)}
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default transactions;

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
