// API route that contains the authentication logic
import { server } from "@/utils/server";
import clientPromise from "@/utils/db/mongodb";
import { withSessionRoute } from "@/utils/withSession";
import { hashPass, comparePass } from "@/utils/encryption";

export default withSessionRoute(loginRoute);

async function loginRoute(req, res) {
	// Get data submitted in request's body.
	const body = req.body;

	// Checks for first name and password entries
	if (!body.firstName || !body.password) {
		// Sends a HTTP bad request error code
		// if they are not found
		return res.json({
			status: 401,
			message: "Please enter your firstname and your password",
		});
	}

	// fetch users list
	const client = await clientPromise;
	const db = client.db(process.env.MONGODB_DB);
	const users = await db.collection("users").find({}).toArray();

	// Get the user that match user's entries
	let user;
	for (user of users) {
		const isSamePass = await comparePass(body.password, user.password);

		if (body.firstName === user.firstName && isSamePass === true) {
			break;
		} else {
			user = 404;
		}
	}

	if (typeof user == "object" && user.firstName !== "") {
		try {
			// set user's session variable
			req.session.myBankSession = {
				id: user._id.toString(),
				fName: user.firstName,
				lName: user.lastName,
			};
			await req.session.save();
			res.send({ ok: true });
		} catch (error) {
			// Sends an HTTP bad request
			// if user is not found
			res.json({ status: 500, message: error });
		}
	} else {
		res.json({ status: 404, message: "Incorrect name or password." });
	}
}
