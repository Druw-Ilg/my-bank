// get user's transaction
import styles from "@/styles/Content.module.scss";
import { dollarSign } from "@/utils/someFunc";

const Transactions = ({ transactions }) => {
	return (
		<>
			{transactions.map((element) => (
				<tr key={element._id}>
					<td>{element.acc_name}</td>
					<td>{element.acc_number}</td>
					<td>{element.trans_type}</td>
					<td>{dollarSign(element.amount)}</td>
					<td>{element.status}</td>
					<td>{element.description}</td>
					<td>{element.created}</td>
					<td>{dollarSign(element.balance)}</td>
				</tr>
			))}
		</>
	);
};

export default Transactions;
