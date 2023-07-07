import { server } from "@/utils/server";
import { hashPass, comparePass } from "@/utils/encryption";
import { withSessionRoute } from "@/utils/withSession";

// signup a new user
export default withSessionRoute(register);

async function register(req, res) {
	const data = req.body; //user's data
	//save user's entry before encryption
	const unhashedPassword = data.password;
	//encrypt user password
	data.password = await hashPass(data.password);

	const endpoint = `${server}/api/user/`;

	let users = await fetch(endpoint, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	let result = await users.json();

	// compare entries with data in the database
	// to see if user already exists
	const user = result.filter((item) => {
		return item.firstName === data.firstName && item.lastName === data.lastName;
	});
	if (user.length >= 1)
		return res.json({
			status: 401,
			message: "This user already exists, log in.",
		});

	//save entries into database

	const sign = await fetch(endpoint, {
		method: "POST",
		headers: {
			accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	result = await sign.json();

	// If the query was accepted redirect or send error message
	if (result.status == 201) {
		try {
			users = await fetch(endpoint, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			result = await users.json();

			let user;
			for (user of result) {
				const isSamePass = await comparePass(unhashedPassword, user.password);

				if (data.firstName === user.firstName && isSamePass === true) {
					break;
				} else {
					user = 404;
				}
			}

			if (typeof user == "object" && user.firstName !== "") {
				// set user's session variable
				req.session.myBankSession = {
					id: user._id.toString(),
					fName: user.firstName,
					lName: user.lastName,
				};
				await req.session.save();
				return res.send({ status: 201, id: user._id });
			} else {
				return res.json({
					status: 500,
					message: "Failed to login. Please try again.",
				});
			}
		} catch (error) {
			// if user is not found
			return res.json({ status: 500, message: error });
		}
	} else {
		res.json(res.status, res.message);
	}
}
