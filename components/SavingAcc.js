import styles from "@/styles/Content.module.scss";
import Accordion from "react-bootstrap/Accordion";
import { dollarSign } from "@/utils/someFunc";
import DepositModal from "@/components/DepositModal";
import TransferModal from "@/components/TransferModal";
import WithdrawModal from "@/components/WithdrawModal";

const SavingAcc = ({
	account,
	savingAccounts,
	businessAccounts,
	handleComponentReturn,
}) => {
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
				<div className={styles.accounts_transaction_btn}>
					<DepositModal
						acc_name={account.acc_name}
						acc_number={account.acc_number}
						balance={account.balance}
						document={"saving_doc"}
						userId={account.user_id}
					/>
					<TransferModal
						acc_name={account.acc_name}
						acc_number={account.acc_number}
						donorBalance={account.balance}
						document={"saving_doc"}
						userId={account.user_id}
						savingAccounts={savingAccounts}
						businessAccounts={businessAccounts}
						handleComponentReturn={handleComponentReturn}
					/>
					<WithdrawModal
						acc_name={account.acc_name}
						acc_number={account.acc_number}
						balance={account.balance}
						document={"saving_doc"}
						userId={account.user_id}
					/>
				</div>
			</Accordion.Body>
		</Accordion.Item>
	);
};

export default SavingAcc;
