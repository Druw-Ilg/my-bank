const bCrypt = require("bcrypt");

export function hashPass(unHashPass) {
	return bCrypt.hash(unHashPass, 10).then(function (hash) {
		return hash;
	});
}

export function comparePass(unHashPass, hashPass) {
	return bCrypt.compare(unHashPass, hashPass).then(function (result) {
		return result;
	});
}
