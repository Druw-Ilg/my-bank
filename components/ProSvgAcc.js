// get saving accounts for the profile page
// perform user's account actions

import { server } from "@/utils/server";
import styles from "../styles/Home.module.scss";
import { dollarSign } from "@/utils/someFunc";
import Button from "react-bootstrap/Button";

const ProSvgAcc = ({ account, onDatataGenerated }) => {
	let actionData;

	// delete account
	async function deleteAcc(accountId, acc_number) {
		try {
			const JSONdata = JSON.stringify({
				id: accountId,
				field: "saving_acc",
			});

			const req = await fetch(`${server}/api/user/`, {
				method: "DELETE",
				// Tell the server we're sending JSON.
				headers: {
					"Content-Type": "application/json",
				},
				body: JSONdata,
			});

			const res = await req.json();
			if (res.status === 200) {
				actionData = {
					action: "delete account",
					status: res.status,
					message: res.message,
				};
				onDatataGenerated(actionData);

				// delete all transactions related to this account
				const JsonTransData = JSON.stringify({
					acc_number: acc_number,
				});

				const transToDelete = await fetch(`${server}/api/transactions/`, {
					method: "DELETE",
					// Tell the server we're sending JSON.
					headers: {
						"Content-Type": "application/json",
					},
					body: JsonTransData,
				});

				const deletedTrans = await transToDelete.json();
				// console.log(deletedTrans);
			} else {
				actionData = {
					action: "delete account",
					status: res.status,
					message: res.message,
				};
				onDatataGenerated(actionData);
			}
		} catch (error) {
			actionData = {
				action: "delete account",
				message: error.message,
			};
			onDatataGenerated(actionData);
		}
	}
	return (
		<tr>
			<td>{account.acc_type}</td>
			<td>{account.acc_name}</td>
			<td>{dollarSign(account.balance)}</td>
			<td>{account.created}</td>
			<td>
				<button
					className="btn btn-danger"
					size="sm"
					onClick={() => deleteAcc(account._id.toString(), account.acc_number)}
				>
					<i className="bi bi-trash"></i> Delete
				</button>
			</td>
		</tr>
	);
};

export default ProSvgAcc;
