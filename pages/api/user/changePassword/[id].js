// Passwords validation and encryption

import { hashPass, comparePass } from "@/utils/encryption";
import { server } from "@/utils/server";

const changePassword = async (req, res) => {
	const formData = req.body;
	const hashedPass = await hashPass(formData.newPassword);

	// check if user id is available
	if (req.query.id == "" || req.query.id == undefined) {
		return res.json({
			status: 500,
			message: "An error occured please refresh the page.",
		});
	}
	//Get the user to retrieve his password
	const user = await fetch(`${server}/api/user/${req.query.id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	let data = await user.json();
	// check if the user enterd the right password
	const isSamePass = await comparePass(formData.password, data.password);
	// if the user entered the right password, insert new one.
	if (isSamePass == true) {
		try {
			const newData = JSON.stringify({
				id: req.query.id,
				newPassword: hashedPass,
				field: "password",
			});

			const changePass = await fetch(`${server}/api/user`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: newData,
			});

			const result = await changePass.json();
			if (result.status === 201) {
				return res.json({ status: 201, message: result.message });
			}
		} catch (error) {
			return res.json({
				status: 400,
				message: "An error occured. We couldn't change the password.",
			});
		}
	} else {
		res.json({
			status: 401,
			message: "You entered an incorrect password.",
		});
	}
};
export default changePassword;
