// Get all accounts that belong to a specific user

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
		let datalist = [];
		const pipeline = [
			{
				$match:
					/**
					 * query: The query in MQL.
					 */
					{
						_id: new ObjectId(userId),
					},
			},
			{
				$project:
					/**
					 * specifications: The fields to
					 *   include or exclude.
					 */
					{
						_id: {
							$toString: "$_id",
						},
					},
			},
			{
				$lookup:
					/**
					 * from: The target collection.
					 * localField: The local join field.
					 * foreignField: The target join field.
					 * as: The name for the results.
					 */
					{
						from: "saving_acc",
						localField: "_id",
						foreignField: "user_id",
						as: "userSavingAcc",
					},
			},
			{
				$lookup:
					/**
					 * from: The target collection.
					 * localField: The local join field.
					 * foreignField: The target join field.
					 * as: The name for the results.
					 */
					{
						from: "business_acc",
						localField: "_id",
						foreignField: "user_id",
						as: "userBusinessAcc",
					},
			},
		];

		const aggCursor = await db.collection("users").aggregate(pipeline);

		await aggCursor.forEach((element) => {
			datalist.push(element);
		});
		// console.log(datalist);
		res.json(datalist);
	} catch (error) {
		res.json({ status: 500, message: error.message });
	}
}
