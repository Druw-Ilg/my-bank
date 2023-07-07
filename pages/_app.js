import "../styles/globals.css";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Font files can be colocated inside of `pages`
// const openSans = localFont({
// 	src: "../utils/fonts/OpenSans-VariableFont_wdthwght.ttf",
// });

function MyApp({ Component, pageProps }) {
	return (
		<Layout>
			<Component {...pageProps} />
		</Layout>
	);
}

export default MyApp;
