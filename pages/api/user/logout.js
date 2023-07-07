// destroy current session
import { withSessionRoute } from "@/utils/withSession";

export default withSessionRoute(logout);
function logout(req, res, session) {
	req.session.destroy();
	res.send({ ok: true });
}
