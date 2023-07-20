// get a specific business account

import clientPromise from "@/utils/db/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
	const client = await clientPromise;
	const db = client.db(process.env.MONGODB_DB);

	let accNumber;
	req.query
		? (accNumber = req.query.accNumber)
		: res.json({ status: 404, message: "Incorrect account number" });

	try {
		const data = await db
			.collection("business_acc")
			.findOne({ acc_number: accNumber });

		if (data) {
			res.json({ status: 200, data: data });
		} else {
			throw new Error("This account cannot be found.");
		}
	} catch (error) {
		res.json({
			status: 400,
			message: error.message,
		});
	}
}
