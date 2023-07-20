// handle requests about user
import clientPromise from "@/utils/db/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res, next) {
	const client = await clientPromise;
	const db = client.db(process.env.MONGODB_DB);
	const body = req.body;
	let field;

	switch (req.method) {
		case "GET":
			try {
				const data = await db.collection("users").find({}).toArray();

				res.send(data);
			} catch (error) {
				res.status(500).send({ message: error });
			}
			break;

		case "POST":
			const { firstName, lastName, password, balance } = body;

			try {
				const data = await db.collection("users").insertOne({
					firstName,
					lastName,
					password,
					balance,
				});

				res.send({
					status: 201,
					message: "Welcome to your Bank " + firstName + ".",
				});
			} catch (error) {
				res.send({ status: 401, message: error.message });
			}
			break;

		case "PATCH":
			field = body.field.toString();
			// check if it's a request for balance update
			if (field === "password") {
				try {
					const { id, newPassword } = body;
					const data = await db
						.collection("users")
						.updateOne(
							{ _id: new ObjectId(id) },
							{ $set: { password: newPassword } }
						);
					res.json({ status: 201, message: "Password changed successfully!" });
				} catch (e) {
					res.json({
						status: 500,
						message:
							"An error occured while treating the request. <br/>Contact support team.",
					});
				}
			} else if (field === "balance") {
				try {
					const { acc_number, balance } = body;
					const data = await db
						.collection("users")
						.updateOne({ acc_num: acc_number }, { $set: { balance: balance } });
					res.json({ status: 202, message: "Deposit made successfully!" });
				} catch (e) {
					res.json({
						status: 500,
						message:
							"An error occured while treating the request. <br/>Contact support team.",
					});
				}
			} else if (field === "business_acc") {
				// set business_acc to true. Meaning the user has a business account
				try {
					const { id, enable_business_acc } = body;
					const data = await db
						.collection("users")
						.updateOne(
							{ _id: new ObjectId(id) },
							{ $set: { business_acc: enable_business_acc } }
						);
					res.json({ status: 201 });
				} catch (e) {
					res.json({
						status: 500,
					});
				}
			} else if (field === "saving_acc") {
				// set saving_acc to true. Meaning the user has a saving account
				try {
					const { id, enable_saving_acc } = body;
					const data = await db
						.collection("users")
						.updateOne(
							{ _id: new ObjectId(id) },
							{ $set: { saving_acc: enable_saving_acc } }
						);
					res.json({ status: 201 });
				} catch (e) {
					res.json({
						status: 500,
					});
				}
			}

			break;

		case "DELETE":
			field = body.field.toString();

			if (field === "business_acc") {
				try {
					const accountId = body.id;
					const deleteAcc = db
						.collection(field)
						.deleteOne({ _id: new ObjectId(accountId) });

					res.json({
						status: 200,
						message: "Business account deleted successfully.",
					});
				} catch (error) {
					res.json({ status: 500, message: error.message });
				}
			} else if (field === "saving_acc") {
				try {
					const accountId = body.id;
					const deleteAcc = db
						.collection(field)
						.deleteOne({ _id: new ObjectId(accountId) });

					res.json({
						status: 200,
						message: "Saving account deleted successfully.",
					});
				} catch (error) {
					res.json({ status: 500, message: error.message });
				}
			}
			break;

		default:
			res.json({ status: 401, message: "What are you doing here?" });
	}
}
