// Api for handling the functionality of getting one user
import clientPromise from "@/utils/db/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
	const client = await clientPromise;
	const db = client.db(process.env.MONGODB_DB);
	let userId;
	req.query
		? (userId = req.query)
		: res.json({ message: "No id in parameters." });

	try {
		const data = await db
			.collection("users")
			.findOne({ _id: new ObjectId(userId) });

		res.json(data);
	} catch (error) {
		res.json({status:500, message: error.message });

	}
}
