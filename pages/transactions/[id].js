import { server } from "@/utils/server";
import Link from "next/link";
import Heads from "@/components/Heads";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/Content.module.scss";

const transactions = ({ user }) => {
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
							{/* Information must come from server */}

							<table className="table table-striped table-hover table-responsive">
								<thead className="thead-dark">
									<tr>
										<th>Service</th>
										<th>Date</th>
										<th>Amount</th>
										<th>balance</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Movilib</td>
										<td>12/05/22</td>
										<td>$25</td>
										<td>$100</td>
									</tr>
									<tr>
										<td>Movilib</td>
										<td>12/05/22</td>
										<td>$25</td>
										<td>$100</td>
									</tr>
									<tr>
										<td>Movilib</td>
										<td>12/05/22</td>
										<td>$25</td>
										<td>$100</td>
									</tr>
									<tr>
										<td>Clinic</td>
										<td>18/05/22</td>
										<td>$40</td>
										<td>$75</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										{/* Should display the total balance from the server */}
										<td></td>
										<td></td>
										<td></td>
										<td>$5000</td>
									</tr>
								</tfoot>
							</table>
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
