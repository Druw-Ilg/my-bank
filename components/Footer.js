import styles from "../styles/Home.module.scss";

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<p>
				Designed & Developed by
				<a href="https://andruwilagou.web.app" className={styles.logo}>
					{" "}
					Andruw Ilagou
				</a>
			</p>
		</footer>
	);
};

export default Footer;
