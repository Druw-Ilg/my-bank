// Wrapper for user session

import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const sessionOptions = {
	password: process.env.SESSION_PASSWORD,
	cookieName: "myBankSession",
	// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
	cookieOptions: {
		secure: process.env.NODE_ENV === "development",
	},
};

export function withSessionRoute(handler) {
	return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler) {
	return withIronSessionSsr(handler, sessionOptions);
}
