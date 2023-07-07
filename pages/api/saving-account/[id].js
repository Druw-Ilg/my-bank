// get a specific saving account

import clientPromise from "@/utils/db/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
	const client = await clientPromise;
	const db = client.db(process.env.MONGODB_DB);

	let accNumber;
	req.query
		? (accNumber = req.query.id)
		: res.json({ status: 404, message: "Incorrect account number" });

	try {
		const data = await db
			.collection("saving_acc")
			.findOne({ acc_number: accNumber });

		if (data._id != "") {
			res.json({ status: 200, data: data });
		} else {
			throw new Error("This account cannot be found.");
		}
	} catch (error) {
		res.json({
			status: 404,
			message: error.message,
		});
	}
}
