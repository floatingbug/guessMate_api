const {handleServerError} = require("./handleServerError");
const {randomUUID} = require("crypto");

function addQuiz({store}){
	return (req, res) => {
		handleRequest({req, res, store});
	}
}

async function handleRequest(params){
	const {req, res, store} = params;

	//check if user has created 8 quizzes allready
	const query = {
		creatorId: req.user.userId
	};
	try{
		const quizzes = await store.getQuizzes(query);
		if(quizzes.length >= 8) return res.status(400).json({success: false, msg: "This user has 8 quizzes already."});
	}
	catch(err){
		return handleServerError({err, res});
	}

	//add quiz
	const doc = {
		quizId: randomUUID(),
		creatorId: req.user.userId,
		creatorName: req.user.name,
		quizTitle: req.body.quizTitle,
		quiz: req.body.quiz
	};
	try{
		await store.addQuiz(doc);
	}
	catch(err){
		return handleServerError({err, res});
	}

	res.status(200);
	res.json({success: true, msg: "Quiz has been added."});
}


module.exports = {addQuiz};
