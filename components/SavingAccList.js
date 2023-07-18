import SavingAcc from "@/components/SavingAcc";

const SavingAccList = ({
	accounts,
	businessAccounts,
	handleComponentReturn,
}) => {
	// insert accounts in an array to map them easily

	const accountList = [];

	const convertAcc = (acc) => {
		for (let key = 0; key < acc.length; key++) {
			accountList.push(acc[key]);
		}
	};

	convertAcc(accounts);

	return (
		<>
			{accountList.map((account) => (
				<SavingAcc
					key={account._id}
					account={account}
					savingAccounts={accounts}
					businessAccounts={businessAccounts}
					handleComponentReturn={handleComponentReturn}
				/>
			))}
		</>
	);
};
export default SavingAccList;
