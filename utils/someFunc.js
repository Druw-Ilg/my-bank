import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alert from "react-bootstrap/Alert";

// generate today's date

export function today() {
	const d = new Date();
	return new Intl.DateTimeFormat().format(d);
}

// generate 11 digits for account number

export function accNumGen() {
	let randomNumbers = new Array(11)
		.fill(0)
		.map(() => Math.floor(Math.random() * 10));

	return randomNumbers.join("");
}

// return amount with dollar sign

export function dollarSign(amount) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount);
}

// Toaster functions

export const toastSuccess = (message) => {
	toast.success(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
};

export const toastError = (message) => {
	toast.error(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
};

export const toastWarning = (message) => {
	toast.warn(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
};

// alert function
// variant: primary, secondary,success,danger, warning, info, light, dark
export const alert = (variant, message) => {
	return (
		<Alert key={variant} variant={variant}>
			{message}
		</Alert>
	);
};
