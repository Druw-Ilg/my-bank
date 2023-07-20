// get user's transaction
import styles from "@/styles/Content.module.scss";
import { dollarSign } from "@/utils/someFunc";

const Payments = ({ payments }) => {
	return (
		<>
			{payments.map((element) => (
				<tr key={element._id}>
					<td>{element.payerName}</td>
					<td>{dollarSign(element.amount)}</td>
					<td>{element.beneficiaryName}</td>
					<td>{element.paymentStatus}</td>
					<td>{element.reference}</td>
					<td>{element.created}</td>
				</tr>
			))}
		</>
	);
};

export default Payments;
