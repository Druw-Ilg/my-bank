// get saving accounts list for the profile page

import ProSvgAcc from "@/components/ProSvgAcc";

const ProSvgAccList = ({ accounts }) => {
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
				<ProSvgAcc key={account._id} account={account} />
			))}
		</>
	);
};
export default ProSvgAccList;
