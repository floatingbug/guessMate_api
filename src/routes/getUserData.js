const {handleServerError} = require("./handleServerError");

function getUserData({store}){
	return (req, res) => {
		handleRequest({req, res, store});
	}
}


async function handleRequest(params){
	const {req, res, store} = params;

	const queryQuizzes = {
		creatorId: req.user.userId
	};
	const queryAnswers = {
		quizTakerId: req.user.userId
	};
	const queryGuesses = {
		guesserId: req.user.userId
	};
	const userData = {};

	try{
		const result = await store.getQuizzes(queryQuizzes);
		userData.quizzes = result;
	}
	catch(err){
		return handleServerError({err, res});
	}

	try{
		const result = await store.getAnswers(queryAnswers);
		userData.answers = result;
	}
	catch(err){
		return handleServerError({err, res});
	}

	try{
		const result = await store.getGuesses(queryGuesses);
		userData.guesses = result;
	}
	catch(err){
		return handleServerError({err, res});
	}

	res.status(200).json({success: true, msg: "User Data has been sent.", data: userData});
}


module.exports = {getUserData};
