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

	//add answers to userData.guesses
	if(userData.guesses.length > 0){
		const answersIds = userData.guesses.map(g => ({answersId: g.answersId}));
		let answers = null;

		try{
			const query = {
				$or: answersIds
			};
			answers = await store.getAnswers(query);
			if(answers.length < 1) return res.status(500).json({success: false, msg: "Fail to get answers of guesses."});
		}
		catch(err){
			return handleServerError({err, res});
		}

		userData.guesses.forEach(g => {
			answers.forEach(a => {
				if(a.answersId === g.answersId){
					g.addAnswers = a.addAnswers;
				}
			});
		});
	}

	res.status(200).json({success: true, msg: "User Data has been sent.", data: userData});
}



module.exports = {getUserData};
