const {handleServerError} = require("./handleServerError");
const {randomUUID} = require("crypto");

function addAnswers({store}){
	return (req, res) => {
		handleRequest({req, res, store})
	};
}


async function handleRequest(params){
	const {req, res, store} = params;

	//get quiz by quizId to get quiz information
	let quiz = null;
	try{
		const doc = {quizId: req.body.quizId};

		quiz = await store.getQuizzes(doc);
		if(quiz.length < 1){
			return res.status(200).json({success: false, msg: "Quiz with given quizId does not exists."});
		}
		quiz = quiz[0];
	}
	catch(err){
		return handleServerError({err, res});
	}

	try{
		const doc = {
			quizId: req.body.quizId,
			quizTitle: quiz.quizTitle,
			creatorName: quiz.creatorName,
			quizTakerId: req.user.userId,
			quizTaker: req.user.name,
			answersId: randomUUID(),
			addAnswers: req.body.answers
		};

		await store.addAnswers(doc);
	}
	catch(err){
		return handleServerError({err, res});
	}

	res.status(200).json({success: true, msg: "Answers added."});
}


module.exports = {addAnswers};
