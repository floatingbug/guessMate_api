const {handleServerError} = require("./handleServerError");
const {randomUUID} = require("crypto");

function addGuess({store}){
	return (req, res) => {
		handleRequest({req, res, store})
	};
}


async function handleRequest(params){
	const {req, res, store} = params;
	let answers = null;
	let quiz = null;

	//check if answers exists and save answers for information
	try{
		const query = {
			answersId: req.body.answersId
		};

		answers = await store.getAnswers(query);
		answers = answers[0];
	}
	catch(err){
		return handleServerError({err, res});
	}

	//check if quiz with quizId exists and save quizId information in quiz
	try{
		const query = {quizId: answers.quizId};

		quiz = await store.getQuizzes(query);
		if(quiz.length < 1){
			return res.status(200).json({success: false, msg: "Quiz with given quizId does not exists."});
		}
		quiz = quiz[0];
	}
	catch(err){
		return handleServerError({err, res});
	}
	
	//check if user has allready guessed the answers from the user

	//add guess
	try{
		const doc = {
			quizId: quiz.quizId,
			answersId: req.body.answersId,
			guessId: randomUUID(),
			guesserId: req.user.userId,
			quizCreator: quiz.creatorName,
			quizTaker: answers.quizTaker,
			guesserName: req.user.name,
			guesses: req.body.guesses
		};
		
		await store.addGuess(doc);
	}
	catch(err){
		return handleServerError({err, res});
	}

	res.status(200).json({success: true, msg: "Guesses have been added."});
}



module.exports = {addGuess};
