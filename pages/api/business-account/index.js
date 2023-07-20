// handle requests about user
import clientPromise from "@/utils/db/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res, next) {
	const client = await clientPromise;
	const db = client.db(process.env.MONGODB_DB);
	const body = req.body;

	switch (req.method) {
		case "GET":
			try {
				const data = await db.collection("business_acc").find({}).toArray();

				res.send({
					status: 200,
					data: data,
				});
			} catch (error) {
				res.send({
					status: 401,
					message: "An error occurred while retrieving business account",
				});
			}
			break;

		case "POST":
			try {
				const {
					user_id,
					acc_type,
					business_name,
					acc_number,
					balance,
					created,
				} = body;

				const data = await db.collection("business_acc").insertOne({
					user_id,
					business_name,
					acc_type,
					acc_number,
					balance,
					created,
				});

				res.send({
					status: 201,
					message: "Business account created successfully",
				});
			} catch (error) {
				res.send({
					status: 401,

					message:
						"An error occurred while creating business account. " +
						error.message,
				});
			}
			break;

		case "PATCH":
			const field = body.field.toString();
			// check if it's a request for balance update
			if (field === "balance") {
				try {
					const { acc_number, balance } = body;
					const data = await db
						.collection("business_acc")
						.updateOne(
							{ acc_number: acc_number },
							{ $set: { balance: balance } }
						);
					res.json({ status: 202, message: "Deposit made successfully!" });
				} catch (e) {
					res.json({
						status: 500,
						message:
							"An error occured while treating the request. <br/>Contact support team.",
					});
				}
			}

			break;

		case "DELETE":
			try {
				const { user_id } = body;

				const data = await db.collection("business_acc").deleteOne({ user_id });

				res.send({
					status: 201,
					message: "Account deleted successfully",
				});
			} catch (error) {
				res.status(500).send({
					message:
						"An error occured while deleting the account. <br/>Contact support team",
				});
			}
			break;

		default:
			res.status(401).send({ message: "What are you doing here?" });
	}
}
