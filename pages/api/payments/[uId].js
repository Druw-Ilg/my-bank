// Get all payments related to the user

import clientPromise from "@/utils/db/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
	const client = await clientPromise;
	const db = client.db(process.env.MONGODB_DB);
	let userId;
	req.query
		? (userId = req.query.uId.toString())
		: res.json({ message: "No id in parameters." });

	try {
		const query = {
			$or: [{ payerId: userId }, { beneficiary_id: userId }],
		};

		const payments = await db.collection("payments").find(query).toArray();

		res.json(payments);
	} catch (error) {
		res.json({ status: 500, message: error.message });
	}
}
