import styles from "@/styles/Home.module.scss";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useReducer, useState } from "react";
import { useRouter } from "next/router";
import { server } from "@/utils/server";
import BounceLoader from "react-spinners/BounceLoader";

// use of a reducer to collect form data

const formReducer = (state, event) => {
	return {
		...state,
		[event.target.name]: event.target.value,
	};
};

// spinner props
const override = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

const Signup = () => {
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useReducer(formReducer, {});
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();

	const loadDashboard = (id) => {
		const userId = id.toString();
		router.push(`${server}/dashboard/${userId}`);
	};

	const signupForm = async (e) => {
		e.preventDefault();

		// spinner on
		setLoading(true);

		if (formData.password !== formData.confirm_password) {
			const errorPass = "Passwords do not match!";
			setErrorMessage(errorPass);
		} else if (Object.keys(formData).length == 0) {
			console.log("Empty form data");
		} else {
			// convert form data to json format
			const jsonData = JSON.stringify(formData);
			// define endpoint
			const endpoint = "./api/user/register";
			// set options for req.body
			const options = {
				method: "POST",
				// Tell the server we're sending JSON.
				headers: {
					"Content-Type": "application/json",
				},
				body: jsonData,
			};
			// send data to API endpoint
			const register = await fetch(endpoint, options);
			const res = await register.json();

			if (res.status < 300) {
				loadDashboard(res.id);
			} else {
				setErrorMessage(res.message);
			}
		}

		// spinner off
		setLoading(false);
	};

	return (
		<div className={styles.container}>
			<main className={styles.main}>
				<h1 className={styles.title}>
					Welcome to <Link href="/">Your Bank</Link>
				</h1>

				<form className={styles.form} onSubmit={signupForm}>
					<p className={styles.form_title}>Sign up</p>
					<p className={styles.errorMessage}>{errorMessage}</p>

					<div className={styles.field}>
						<label>First Name</label>
						<input
							type="text"
							name="firstName"
							required
							onChange={setFormData}
						/>
					</div>

					<div className={styles.field}>
						<label>Last Name</label>
						<input
							type="text"
							name="lastName"
							required
							onChange={setFormData}
						/>
					</div>

					<div className={styles.field}>
						<label>
							Deposit:
							<span className={styles.deposit_price_range}>
								(Min: $50 - Max: $1000.000)
							</span>
						</label>
						<input
							type="number"
							name="balance"
							min="50"
							max="1000000"
							required
							onChange={setFormData}
						/>
					</div>

					<div className={styles.field}>
						<label>Password</label>
						<input
							type="password"
							name="password"
							minLength="7"
							required
							onChange={setFormData}
						/>
					</div>
					<div className={styles.field}>
						<label>Confirm Password</label>
						<input
							type="password"
							name="confirm_password"
							required
							onChange={setFormData}
							className="errorField"
						/>
					</div>

					{loading ? (
						<BounceLoader
							color="#0070f3"
							loading={loading}
							cssOverride={override}
							size={30}
							aria-label="Loading Spinner"
							data-testid="loader"
						/>
					) : (
						<button type="submit">Submit</button>
					)}

					<p className={styles.create_account}>
						Already have an account?{" "}
						<span>
							<Link href="/">Log in</Link>
						</span>
					</p>
				</form>
			</main>

			<Footer />
		</div>
	);
};

export default Signup;
