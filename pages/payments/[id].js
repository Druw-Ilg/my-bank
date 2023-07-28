import Table from "react-bootstrap/Table";
import { server } from "@/utils/server";
import Heads from "@/components/Heads";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/Content.module.scss";
import PaymentComponent from "@/components/PaymentComponent";
import { alert } from "@/utils/someFunc";

const Payments = ({ user, paymentData }) => {
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
							{paymentData.length < 1 ? (
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
										<PaymentComponent payments={paymentData} />
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

export default Payments;

// Fetch data from user and payments api

Payments.getInitialProps = async (ctx) => {
	try {
		const id = ctx.query.id;
		const res = await fetch(`${server}/api/user/${id}`);
		const user = await res.json();

		const paymentsReq = await fetch(`${server}/api/payments/${id}`);
		const paymentData = await paymentsReq.json();
		return {
			user: user,
			paymentData: paymentData,
		};
	} catch (error) {
		return console.log(error.message);
	}
};
