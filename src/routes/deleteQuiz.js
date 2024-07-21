const {handleServerError} = require("./handleServerError");

function deleteQuiz({store}){
	return (req, res) => {
		handleRequest({req, res, store});
	}
}


async function handleRequest(params){
	const {req, res, store} = params;

	if(!req.body || !req.body.quizId || typeof req.body.quizId !== "string"){
		return res.status(400).json({success: false, msg: "Fail to delete quiz. Wrong properties."});
	}

	//check if user is the owner of the quiz and check if quiz exists
	try{
		const query = {
			quizId: req.body.quizId,
			creatorId: req.user.userId
		};

		const quiz = await store.getQuizzes(query);
		if(quiz.length < 1){
			return res.status(400).json({success: false, msg: "Quiz with given quizId does not exists or you are not the owner of the quiz."});
		}
	}
	catch(err){
		return handleServerError({err, res});
	}

	//delete quiz and answers guesses that belongs to the quiz
	try{
		const quizDoc = {
			quizId: req.body.quizId,
			creatorId: req.user.userId
		};
		const answersDoc = {
			quizId: req.body.quizId
		};
		const guessesDoc = {
			quizId: req.body.quizId
		};

		const result = await store.deleteQuiz(quizDoc, answersDoc, guessesDoc);
		if(!result){
			return res.status(400).json({success: false, msg: "Fail to delete quiz. Please try again."});
		}
	}
	catch(err){
		return handleServerError({err, res});
	}

	res.status(200).json({success: true, msg: "Quiz has been deleted."});
}


module.exports = {deleteQuiz};
