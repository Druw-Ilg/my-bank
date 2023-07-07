import styles from "../styles/Home.module.scss";
import Accordion from "react-bootstrap/Accordion";
import { dollarSign } from "@/utils/someFunc";

const SavingAcc = ({ account }) => {
	return (
		<Accordion.Item eventKey={account._id}>
			<Accordion.Header>{account.acc_name}</Accordion.Header>
			<Accordion.Body>
				<div className="container">
					<table className="table table-striped table-hover table-responsive">
						<tbody>
							<tr>
								<th scope="row">Name</th>
								<td>{account.acc_name}</td>
							</tr>
							<tr>
								<th scope="row">Account Type</th>
								<td>{account.acc_type}</td>
							</tr>
							<tr>
								<th scope="row">Account Number</th>
								<td>{account.acc_number}</td>
							</tr>
							<tr>
								<th scope="row">Balance</th>
								<td>{dollarSign(account.balance)}</td>
							</tr>
							<tr>
								<th scope="row">Date Creation</th>
								<td>{account.created}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</Accordion.Body>
		</Accordion.Item>
	);
};

export default SavingAcc;
