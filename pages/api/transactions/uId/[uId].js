// get user's transactions

import clientPromise from "@/utils/db/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
	const client = await clientPromise;
	const db = client.db(process.env.MONGODB_DB);

	let uId;
	req.query
		? (uId = req.query.uId)
		: res.json({ status: 404, message: "Incorrect id number" });

	try {
		const data = await db
			.collection("transactions")
			.find({ user_id: uId.toString() })
			.toArray();

		if (data.length > 0) {
			res.json({ status: 200, data: data });
		} else {
			throw new Error("No transactions to show for the moment.");
		}
	} catch (error) {
		res.json({
			status: 404,
			message: error.message,
		});
	}
}
