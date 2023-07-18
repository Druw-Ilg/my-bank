// handle transaction's requests
import clientPromise from "@/utils/db/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res, next) {
	const client = await clientPromise;
	const db = client.db(process.env.MONGODB_DB);
	const body = req.body;

	switch (req.method) {
		case "POST":
			try {
				const {
					user_id,
					acc_name,
					acc_number,
					transactionType,
					amount,
					status,
					description,
					balance,
					created,
				} = body;

				const data = await db.collection("transactions").insertOne({
					user_id,
					acc_name,
					acc_number,
					trans_type: transactionType,
					amount,
					status,
					description,
					balance,
					created,
				});

				res.send({
					status: 201,
				});
			} catch (error) {
				res.send({
					status: 401,
					message:
						"An error occurred while saving the transaction / " + error.message,
				});
			}
			break;

		case "DELETE":
			try {
				const { transaction } = body;
				const data = await db
					.collection("transactions")
					.deleteOne({ user_id: user_id });

				res.send({
					status: 201,
					message: "Transaction deleted successfully",
				});
			} catch (error) {
				res.status(500).send({
					message:
						"An error occured while trying to delete the transaction. <br/>Contact support team",
				});
			}
			break;

		default:
			res.status(401).send({ message: "What are you doing here?" });
	}
}
