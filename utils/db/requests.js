// database's requests
// import { ObjectId } from "mongodb";

export async function getUsers(db, coll) {
	// first connect to collection

	const users = await db.collection(coll).find({}).toArray();
	return users;
}

export async function getUser(db, coll, userId) {
	const users = await db.collection(coll).findOne({ userId });
	return users.toArray();
}

export async function postUser(db, coll, user) {
	const entry = await db.collection(coll).insertOne({ user });
	return entry[0];
}

export async function patchUser(db, coll, userId, modif) {
	const user = await db
		.collection(coll)
		.updateOne({ _id: new ObjectId(`${userId}`) }, { $set: modif });
	return user[0];
}

export async function deleteUser(db, coll, userId) {
	return db.collection(coll).deleteOne({ _id: new ObjectId(`${userId}`) });
}
