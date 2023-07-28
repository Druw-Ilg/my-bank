import { server } from "@/utils/server";
import Link from "next/link";
import Heads from "@/components/Heads";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/Content.module.scss";

const Services = ({ user }) => {
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

						<a href="https://movilib.web.app" className={styles.service}>
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

export default Services;

// fetch user's data from API
Services.getInitialProps = async (ctx) => {
	try {
		const id = ctx.query.id;
		const res = await fetch(`${server}/api/user/${id}`);
		const user = await res.json();
		return {
			user: user,
		};
	} catch (error) {
		return console.log(error.message);
	}
};
