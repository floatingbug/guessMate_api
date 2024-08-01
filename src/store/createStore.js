const {MongoClient} = require("mongodb");
const uri = "mongodb://localhost:27017,localhost:27018/guessMate?replicaSet=rs0";
const client = new MongoClient(uri);
const db = client.db("guessMate");

function createStore(){
	const store = {
		client,
		db,
		confirmEmail,
		addUser,
		addQuiz,
		addAnswers,
		addGuess,
		getUser,
		getQuizzes,
		getAllQuizzes,
		getAnswers,
		getAllAnswers,
		getGuesses,
		deleteQuiz,
		deleteAnswers,
		deleteGuesses,
	};

	return store;
}


async function confirmEmail(filter){
	const users = this.db.collection("users");
	const doc = {
		$set: {
			isEmailConfirmed: true
		},
		$unset: {
			confirmationNumber: ""
		}
	};

	try{
		await this.client.connect();
		const result = await users.updateOne(filter, doc);

		if(result.modifiedCount < 1) throw new Error("Fail to confirm email. Mongod returned modifiedCount with less than 2");
	}
	catch(err){
		throw err;
	}
	finally{
		await this.client.close();
	}
}

async function addUser(doc){
	const users = this.db.collection("users");

	try{
		await this.client.connect();
		const result = await users.insertOne(doc);
		
		if(!result.acknowledged) throw new Error("Fail to add user: Mongod returned acknowledged = false");
	}
	catch(err){
		throw err;
	}
	finally{
		await this.client.close();
	}
}

async function addQuiz(doc){
	const quizzes = this.db.collection("quizzes");

	try{
		await this.client.connect();
		const result = await quizzes.insertOne(doc);

		if(!result.acknowledged) throw new Error("Fail to add quiz: Mongod returned acknowledged = false");
	}
	catch(err){
		throw err;
	}
	finally{
		await this.client.close();
	}
}

async function addAnswers(doc){
	const answers = this.db.collection("answers");

	try{
		await this.client.connect();
		const result = await answers.insertOne(doc);

		if(!result.acknowledged) throw new Error("Fail to add answers: Mongod returned acknowledged = false.");
	}
	catch(err){
		throw err;
	}
	finally{
		await this.client.close();
	}
}

async function addGuess(doc){
	const guessesCollection = this.db.collection("guesses");

	try{
		await this.client.connect();
		const result = await guessesCollection.insertOne(doc);

		if(!result.acknowledged) throw new Error("Fail to add guesses: Mongod returned acknowledged = false.");
	}
	catch(err){
		throw err;
	}
	finally{
		await this.client.close();
	}
}

async function getUser(query){
	const users = this.db.collection("users");

	try{
		await this.client.connect();
		const result = await users.findOne(query);
		return result;
	}
	catch(err){
		throw err;
	}
	finally{
		await this.client.close();
	}
}

async function getQuizzes(query){
	const quizzesCollection = this.db.collection("quizzes");

	try{
		await this.client.connect();
		const result = await quizzesCollection.find(query);
		const quizzes = await result.toArray();
		
		return quizzes;
	}
	catch(err){
		throw err;
	}
	finally{
		await this.client.close();
	}
}

async function getAllQuizzes(){
	const quizzesCollection = this.db.collection("quizzes");

	try{
		await this.client.connect();
		const result = await quizzesCollection.find();
		const quizzes = await result.toArray();

		if(quizzes.length < 1) return null;

		return quizzes;
	}
	catch(err){
		throw err;
	}
	finally{
		await this.client.close();
	}
}

async function getAnswers(query){
	const answersCollection = this.db.collection("answers");
	
	try{
		await this.client.connect();

		const result = await answersCollection.find(query);
		const answers = await result.toArray();

		return answers
	}
	catch(err){
		throw err;
	}
	finally{
		await this.client.close();
	}
}

async function getAllAnswers(){
	const answersCollection = this.db.collection("answers");

	try{
		await this.client.connect();

		const result = await answersCollection.find();
		const answers = await result.toArray();

		return answers;
	}
	catch(err){
		throw err;
	}
	finally{
		await this.client.close();
	}
}

async function getGuesses(query){
	const guessesCollection = this.db.collection("guesses");

	try{
		await this.client.connect();

		const result = await guessesCollection.find(query);
		const guesses = await result.toArray();
		return guesses;
	}
	catch(err){
		throw err;
	}
	finally{
		await this.client.close();
	}
}

async function deleteQuiz(quizDoc, answersDoc, guessesDoc){
	const quizzesCollection = this.db.collection("quizzes");
	const answersCollection = this.db.collection("answers");
	const guessesCollection = this.db.collection("guesses");
	const session = this.client.startSession();

	try{
		await this.client.connect();
		session.startTransaction();

		//delete answers
		const answerResult = await answersCollection.deleteMany(answersDoc, {session});
		if(!answerResult.acknowledged){
			await session.abortTransaction();
			return null;
		}
		
		//delete guesses
		const guessResult = await guessesCollection.deleteMany(guessesDoc, {session});
		if(!guessResult.acknowledged){
			await session.abortTransaction();
			return null;
		}

		//delete quiz
		const quizResult = await quizzesCollection.deleteOne(quizDoc, {session});
		if(!quizResult.acknowledged){
			await session.abortTransaction();
			return null;
		}

		await session.commitTransaction();
		return true;
	}
	catch(err){
		await session.abortTransaction();
		throw err;
	}
	finally{
		session.endSession();
		await this.client.close();
	}
}

async function deleteAnswers(docAnswers, docGuesses){
	const answersCollection = this.db.collection("answers");
	const guessesCollection = this.db.collection("guesses");
	const session = this.client.startSession();

	try{
		await this.client.connect();
		session.startTransaction();

		const guessResult = await guessesCollection.deleteMany(docGuesses, {session});
		if(!guessResult.acknowledged){
			await session.abortTransaction();
			return null;
		}

		const answerResult = await answersCollection.deleteMany(docAnswers, {session});
		if(!answerResult.acknowledged){
			await session.abortTransaction();
			return null;
		}

		await session.commitTransaction();
		return true;
	}
	catch(err){
		throw err;
	}
	finally{
		session.endSession();
		await this.client.close();
	}
}

async function deleteGuesses(doc){
	const guessesCollection = this.db.collection("guesses");

	try{
		await this.client.connect();
		const result = await guessesCollection.deleteOne(doc);
		if(result.deletedCount < 1){
			return false;
		}
	}
	catch(err){
		throw err;
	}
	finally{
		this.client.close();
	}

	return true;
}


module.exports = {createStore};
