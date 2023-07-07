import Link from "next/link";
import { server } from "../utils/server";
import { useRouter } from "next/router";
import styles from "../styles/Content.module.scss";

const Header = ({ page }) => {
	const router = useRouter();

	const handleLogout = async () => {
		const logoutUrl = `${server}/api/user/logout`;
		const logout = await fetch(logoutUrl);
		const res = await logout.json();
		if (res.ok) router.push("/");
	};
	return (
		<div className={styles.header}>
			<h1>{page}</h1>
			<div className={styles.logout}>
				<a onClick={handleLogout}>
					<i className="bi bi-box-arrow-right"></i> Logout
				</a>
			</div>
		</div>
	);
};

export default Header;
