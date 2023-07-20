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
					payerId,
					payerName,
					beneficiary_id,
					beneficiaryName,
					amount,
					paymentStatus,
					reference,
					created,
				} = body;

				const data = await db.collection("payments").insertOne({
					payerId,
					payerName,
					beneficiary_id,
					beneficiaryName,
					amount,
					paymentStatus,
					reference,
					created,
				});

				res.send({
					status: 201,
				});
			} catch (error) {
				res.send({
					status: 401,
					message:
						"An error occurred while saving the payment / " + error.message,
				});
			}
			break;

		case "DELETE":
			try {
				const { payment } = body;
				const data = await db
					.collection("payments")
					.deleteOne({ user_id: user_id });

				res.send({
					status: 201,
					message: "Payment deleted successfully",
				});
			} catch (error) {
				res.status(500).send({
					message:
						"An error occured while trying to delete the payment. <br/>Contact support team",
				});
			}
			break;

		default:
			res.status(401).send({ message: "What are you doing here?" });
	}
}
