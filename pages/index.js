import { server } from "@/utils/server";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { withSessionSsr } from "@/utils/withSession";
import Heads from "@/components/Heads";
import styles from "@/styles/Home.module.scss";
import Footer from "@/components/Footer";
import BounceLoader from "react-spinners/BounceLoader";

// spinner props
const override = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

export default function Home() {
	const [loading, setLoading] = useState(false);
	const [firstName, setFirstName] = useState();
	const [password, setPassword] = useState();
	const [reload, setReload] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const router = useRouter();

	// function to refresh the page
	const refreshPage = () => {
		router.replace(router.asPath);
	};

	// handle form submition
	const handleSubmit = async (e) => {
		//prevent default behavior
		e.preventDefault();

		// spinner on
		setLoading(true);

		/*get the form data and insert them into
		 *an object for better handling
		 */
		const data = {
			firstName,
			password,
		};

		// convert data to json format
		const JSONdata = JSON.stringify(data);

		// API endpoint
		const endpoint = "./api/user/login";

		// Form the request to send data to the server.
		const options = {
			method: "POST",
			// Tell the server we're sending JSON.
			headers: {
				"Content-Type": "application/json",
			},
			body: JSONdata,
		};

		// Send the form data to API.
		const login = await fetch(endpoint, options);

		// get result from login
		const res = await login.json();

		// spinner off
		setLoading(false);

		if (res.status >= 400) {
			setErrorMessage(res.message);
		} else if (res.ok) {
			refreshPage();
		}
	};

	return (
		<div className={styles.container}>
			<Heads />

			<main className={styles.main}>
				<h1 className={styles.title}>
					Welcome to <a href="/">Your Bank</a>
				</h1>

				<form className={styles.form} onSubmit={handleSubmit}>
					<p className={styles.form_title}>Login</p>
					<p className={styles.errorMessage}>{errorMessage}</p>
					{loading && (
						<BounceLoader
							color="#0070f3"
							loading={loading}
							cssOverride={override}
							size={50}
							aria-label="Loading Spinner"
							data-testid="loader"
						/>
					)}
					<div className={styles.field}>
						<label htmlFor="firstName">First Name</label>
						<input
							type="text"
							id="firstName"
							name="firstName"
							required
							onChange={(e) => {
								setFirstName(e.target.value);
							}}
						/>
					</div>
					<div className={styles.field}>
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							name="password"
							required
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
					</div>
					<button>Submit</button>
					<p className={styles.create_account}>
						Don't have an account?{" "}
						<span>
							<Link href="/signup">Sign up</Link>
						</span>
					</p>
				</form>
			</main>
			<Footer />
		</div>
	);
}

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req }) {
		const data = req.session.myBankSession;

		if (data !== undefined && data.fName !== "") {
			const id = data.id;
			return {
				redirect: {
					destination: `${server}/dashboard/${id}`,
					status: 200,
				},
			};
		}
		return {
			props: {},
		};
	}
);
