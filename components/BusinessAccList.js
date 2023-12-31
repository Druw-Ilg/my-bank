import BusinessAcc from "@/components/BusinessAcc";

const BusinessAccList = ({
	accounts,
	savingAccounts,
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
				<BusinessAcc
					key={account._id}
					account={account}
					savingAccounts={savingAccounts}
					businessAccounts={accounts}
					handleComponentReturn={handleComponentReturn}
				/>
			))}
		</>
	);
};
export default BusinessAccList;
