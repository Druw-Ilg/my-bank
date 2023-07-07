// Draft

import clientPromise from "../../utils/db/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
	const client = await clientPromise;
	const db = client.db(process.env.MONGODB_DB);

	let update, user;
	try {
		// let id = "641b247b75fdc68e624dbbf3";
		const users = await db.collection("users").find({}).toArray();

		for (user of users) {
			update = await db
				.collection("users")
				.updateOne(
					{ _id: new ObjectId(user._id) },
					{ $set: { acc_num: accNumGen() } }
				);
			console.log(update);
		}
	} catch (e) {
		res.status(500).json(e);
		throw new Error(e).message;
	}
}
