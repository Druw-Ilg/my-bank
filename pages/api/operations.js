import { server } from "@/utils/server";
import { accNumGen, today } from "@/utils/someFunc";

import Accordion from "react-bootstrap/Accordion";

// get all businesses that belong to a specific user

export async function getBusinesses(uId) {
	const getAccounts = await fetch(`${server}/api/business-account/uId/${uId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const businesses = await getAccounts.json();
	if (businesses.status === 200) {
		return businesses.data;
	} else {
		throw new Error("An error occurred while getting business accounts");
	}
}

// save a business account

export async function postBusinessAcc(data, uId, accChecked) {
	let accountNumber, statusText;
	let statusCode = 200;

	// generate an account number
	// check if account number already exists

	while (true) {
		if (statusCode === 200) {
			accountNumber = accNumGen();
			// following endpoint return a status code of 200 if account exists else 404
			let account = await fetch(
				`${server}/api/business-account/${accountNumber}`
			);
			let acc = await account.json();
			statusCode = acc.status;
		} else {
			break;
		}
	}

	// send account details to database
	// data: user_id, account type, account number, balance = 0(defaukt), business name, created,

	const accountData = JSON.stringify({
		user_id: uId,
		acc_type: data.acc_type,
		acc_number: accountNumber,
		balance: 0,
		business_name: data.accName,
		created: today(),
	});

	const postAccount = await fetch(`${server}/api/business-account`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: accountData,
	});

	const savedAccount = await postAccount.json();

	// business account saved now change business_acc to true
	// in users collection if this one is false

	if (!accChecked) {
		const business_data = JSON.stringify({
			id: uId,
			enable_business_acc: !accChecked,
			field: "business_acc",
		});

		const user = await fetch(`${server}/api/user`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: business_data,
		});
	}

	return savedAccount;
}

// get all saving accounts that belong to a specific user

export async function getSavingAcc(uId) {
	const getAccounts = await fetch(`${server}/api/saving-account/uId/${uId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const businesses = await getAccounts.json();
	if (businesses.status === 200) {
		return businesses.data;
	} else {
		throw new Error("An error occurred while getting saving accounts");
	}
}

// post saving accounts

export async function postSavingAcc(data, uId, accChecked) {
	let accountNumber, statusText;
	let statusCode = 200;

	// generate an account number
	// check if account number already exists

	while (true) {
		if (statusCode === 200) {
			accountNumber = accNumGen();
			// following endpoint return a status code of 200 if account exists else 404
			let account = await fetch(
				`${server}/api/saving-account/${accountNumber}`
			);
			let acc = await account.json();
			statusCode = acc.status;
		} else {
			break;
		}
	}

	// send account details to database
	// data: user_id, account type, account number, balance = 0(defaukt), account name, created,

	const accountData = JSON.stringify({
		user_id: uId,
		acc_type: data.acc_type,
		acc_number: accountNumber,
		balance: 0,
		acc_name: data.accName,
		created: today(),
	});

	const postAccount = await fetch(`${server}/api/saving-account`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: accountData,
	});

	const savedAccount = await postAccount.json();

	// saving account saved now change saving_acc to true
	// in users collection if this one is false

	if (!accChecked) {
		const saving_data = JSON.stringify({
			id: uId,
			enable_saving_acc: !accChecked,
			field: "saving_acc",
		});

		const user = await fetch(`${server}/api/user`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: saving_data,
		});
	}

	return savedAccount;
}
