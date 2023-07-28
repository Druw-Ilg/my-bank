import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

import { server } from "@/utils/server";
import Link from "next/link";
import Heads from "@/components/Heads";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransactionsComponent from "@/components/TransactionsComponent";
import styles from "@/styles/Content.module.scss";
import { getTransactions } from "@/api/operations";
import { dollarSign, alert } from "@/utils/someFunc";

const Transactions = ({ user }) => {
	const [transactions, setTransactions] = useState([]);

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
	});

	return (
		<>
			<Heads />
			<Header page={"Your Transactions"} />

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
						id={styles.breadcrumb_item}
						className="breadcrumb-item active"
						aria-current="page"
					>
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
										<TransactionsComponent transactions={transactions} />
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

export default Transactions;

// Fetch data from users api

Transactions.getInitialProps = async (ctx) => {
	try {
		const id = ctx.query.id;
		const res = await fetch(`${server}/api/user/${id}`);
		const user = await res.json();
		return {
			user: user,
		};
	} catch (error) {
		return console.log(error.message);
	}
};
