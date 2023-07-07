// get saving accounts of a user

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
			.collection("saving_acc")
			.find({ user_id: uId })
			.toArray();

		if (data != null && data != undefined) {
			res.json({ status: 200, data });
		} else {
			throw new Error("This user doesn't have saving account(s).");
		}
	} catch (error) {
		res.json({
			status: 404,
			message: error.message,
		});
	}
}
