import { server } from "@/utils/server";
import Link from "next/link";
import Heads from "@/components/Heads";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/Content.module.scss";

const services = ({ user }) => {
	return (
		<>
			<Heads />
			<Header page={"Available Services"} />

			<nav aria-label="breadcrumb" className={styles.nav_breadcrumb}>
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<a
							href={"/dashboard/" + user._id.toString()}
							id={styles.breadcrumb_item_before}
						>
							Dashboard
						</a>
					</li>
					<li
						className="breadcrumb-item active"
						id={styles.breadcrumb_item}
						aria-current="page"
					>
						Services
					</li>
				</ol>
			</nav>

			<div className={styles.main}>
				<div className={styles.container}>
					<div className={styles.grid}>
						{/* <div className={styles.services}></div> */}

						<a href="#" className={styles.service}>
							<i className="bi bi-film"></i>
							Movilib
						</a>
						<a href="#" className={styles.service}>
							<i className="bi bi-shield-fill-plus"></i>
							My Insurance
						</a>
						<a href="#" className={styles.service}>
							<i className="bi bi-airplane"></i>
							My Flight
						</a>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
};

export const getStaticPaths = async () => {
	// fetch users list
	const res = await fetch(`${server}/api/user`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const users = await res.json();

	// get the paths we want to prerender based on users
	const paths = users.map((user) => {
		return {
			params: { id: user._id.toString() },
		};
	});
	return {
		paths,
		fallback: false,
	};
};

export const getStaticProps = async ({ params }) => {
	// fetch user's data
	const res = await fetch(`${server}/api/user/${params.id}`);
	const user = await res.json();

	return {
		props: { user },
	};
};

export default services;
