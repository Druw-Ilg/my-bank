import { server } from "@/utils/server";
import { accNumGen, today } from "@/utils/someFunc";

import Accordion from "react-bootstrap/Accordion";

// get all business accounts that belong to a specific user

export async function getBusinesses(uId) {
	try {
		const getAccounts = await fetch(`${server}/api/business-account/uId/${uId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		},
	});
	const business_acc = await getAccounts.json();
	if (business_acc.status < 300) {
		return business_acc;
	} else {
		throw new Error(business_acc.message);
	}
	} catch (error) {
		return error
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
	try {
		const getAccounts = await fetch(`${server}/api/saving-account/uId/${uId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		},
	});
	const saving_acc = await getAccounts.json();
	if (saving_acc.status < 300) {
		return saving_acc;
	} else {
		throw new Error(saving_acc.message);
	}
	} catch (error) {
		return error
	}
	
}

// post saving accounts

export async function postSavingAcc(data, uId, accChecked) {
	let accountNumber, statusText;
	let statusCode = 200;

	// generate an account number
	// check if account number already exists

	while (true) {
		if (statusCode < 200) {
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

// post transactions

export async function postTransaction(
	userId,
	acc_name,
	acc_number,
	transactionType,
	amount,
	status,
	description,
	newBalance
) {
	const jsonData = JSON.stringify({
		user_id: userId,
		acc_name: acc_name,
		acc_number: acc_number,
		transactionType: transactionType,
		amount: amount,
		status: status,
		description: description,
		balance: newBalance,
		created: today(),
	});

	const transaction = await fetch(`${server}/api/transactions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: jsonData,
	});

	const result = await transaction.json();

	return result;
}

// get all transactions that belong to a specific user

export async function getTransactions(uId) {
	const getTrans = await fetch(`${server}/api/transactions/uId/${uId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const transactions = await getTrans.json();

	return transactions;
}

// transfer fund from an account to another

export async function transferFund(
	donor,
	donorBalance,
	donorAccType,
	recipientAccNum,
	amount,
	recipientAccType
) {
	const recipientAPI =
		recipientAccType === "Saving Account"
			? "saving-account"
			: recipientAccType === "Business Account"
			? "business-account"
			: "user";

	const donorAPI =
		donorAccType === "saving_doc"
			? "saving-account"
			: donorAccType === "business_doc"
			? "business-account"
			: "user";
	try {
		// deposit into recipient account

		const recipientData = JSON.stringify({
			acc_number: recipientAccNum,
			balance: amount,
			field: "balance",
		});

		const recipientEndpoint = await fetch(`${server}/api/${recipientAPI}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: recipientData,
		});
		const recipientJson = await recipientEndpoint.json();

		if (recipientJson.status < 300) {
			// deduct from donor's account
			const donorData = JSON.stringify({
				acc_number: donor,
				balance: donorBalance,
				field: "balance",
			});

			const donorEndpoint = await fetch(`${server}/api/${donorAPI}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: donorData,
			});

			const jsonResult = {
				status: 200,
				message: "Transfert successfully made.",
			};

			return jsonResult;
		} else {
			const message = "An error occured";
			return message;
		}
	} catch (error) {
		return error.message;
	}
}

// make a payment from a user to another

export async function payment(
	acc_number,
	payerBalance,
	beneficiary_accNumber,
	amount,
	reference,
	document
) {
	try {
		// First, let's try to locate the beneficiary account
		let paymentResponse, paymentRequest, paymentResponseToJson, patchOptions;

		// check if account is in user collection

		let accountRequest = await fetch(
			`${server}/api/user/handle-accounts/getByAccNumber/${beneficiary_accNumber}`
		);
		let accountResponse = await accountRequest.json();

		if (accountResponse.status < 300) {
			// beneficiary is a check account
			// get balance then proceed to payment

			const { _id, balance } = accountResponse.data;

			patchOptions = {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					acc_number: beneficiary_accNumber,
					balance: parseInt(amount) + parseInt(balance),
					field: "balance",
				}),
			};

			paymentRequest = await fetch(`${server}/api/user`, patchOptions);
			paymentResponseToJson = await paymentRequest.json();

			paymentResponse = {
				status: paymentResponseToJson.status,
				beneficiary_id: _id,
			};
			// /* paymentResponse will return with a status code of 202
			//  * if the payment was successfull
			//  * if it doesn't. ...
			//  */
		} else {
			// check if account is in business collection

			accountRequest = await fetch(
				`${server}/api/business-account/${beneficiary_accNumber}`
			);
			accountResponse = await accountRequest.json();

			if (accountResponse.status < 300) {
				// beneficiary is a business account
				// get balance then proceed to payment

				const { user_id, balance } = accountResponse.data;

				patchOptions = {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						acc_number: beneficiary_accNumber,
						balance: parseInt(amount) + parseInt(balance),
						field: "balance",
					}),
				};

				paymentRequest = await fetch(
					`${server}/api/business-account`,
					patchOptions
				);
				paymentResponseToJson = await paymentRequest.json();

				paymentResponse = {
					status: paymentResponseToJson.status,
					beneficiary_id: user_id,
				};
			} else {
				// check if account is in saving collection

				accountRequest = await fetch(
					`${server}/api/user/handle-accounts/getByAccNumber/${beneficiary_accNumber}`
				);
				accountResponse = await accountRequest.json();

				if (accountResponse.status < 300) {
					// beneficiary is a saving account
					// get balance then proceed to payment

					const { user_id, balance } = accountResponse.data;

					patchOptions = {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							acc_number: beneficiary_accNumber,
							balance: parseInt(amount) + parseInt(balance),
							field: "balance",
						}),
					};

					paymentRequest = await fetch(
						`${server}/api/saving-account`,
						patchOptions
					);
					paymentResponseToJson = await paymentRequest.json();

					paymentResponse = {
						status: paymentResponseToJson.status,
						beneficiary_id: user_id,
					};
				}
			}
		}

		if (paymentResponse) {
			// let's deduct the fund from payer account
			const payerAPI =
				document === "saving_doc"
					? "saving-account"
					: document === "business_doc"
					? "business-account"
					: "user";

			const payerEndpoint = `${server}/api/${payerAPI}`;
			const payerOptions = {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					acc_number: acc_number,
					balance: payerBalance,
					field: "balance",
				}),
			};

			const payerRequest = await fetch(payerEndpoint, payerOptions);
			const payerResponse = await payerRequest.json();

			const res = {
				status: payerResponse.status,
				beneficiary_id: paymentResponse.beneficiary_id,
			};
			return res;
		} else {
			return paymentResponse;
		}
	} catch (error) {
		return error.message;
	}
}

// post payment

export async function postPayment(
	payerId,
	acc_name,
	beneficiary_id,
	beneficiaryName,
	amount,
	PaymentStatus,
	reference
) {
	const jsonData = JSON.stringify({
		payerId: payerId,
		payerName: acc_name,
		beneficiary_id: beneficiary_id,
		beneficiaryName: beneficiaryName,
		amount: amount,
		paymentStatus: PaymentStatus,
		reference: reference,
		created: today(),
	});

	const paymentRequest = await fetch(`${server}/api/payments`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: jsonData,
	});

	const result = await paymentRequest.json();

	return result;
}
