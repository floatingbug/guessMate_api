const MAX_QUESTIONS = 24;

function valQuiz(){
	return (req, res, next) => {
		handleRequest({req, res, next});
	}
}

async function handleRequest(params){
	const {req, res, next} = params;

	//required properties
	if(!req.body || !req.body.quizTitle || !req.body.quiz){
		return res.status(400).json({success: false, msg: "Not all properties provided."});
	}

	//no more than required properties.
	const bodyKeys = Object.keys(req.body);
	if(bodyKeys.length > 2){
		return res.status(400).json({success: false, msg: "Too many properties."});
	}

	//type of properties
	if(typeof req.body.quizTitle !== "string" || !Array.isArray(req.body.quiz)){
		return res.status(400).json({success: false, msg: "One or more properties have the wron type."});
	}

	//validate quiz
	const isValidQuiz = validateQuiz(req.body.quiz);
	if(!isValidQuiz.success) return res.status(400).json(isValidQuiz);
	
	next();
}

function validateQuiz(quiz){
	if(quiz.length > MAX_QUESTIONS){
		return {success: false, msg: `Maximum questions per quiz is ${MAX_QUESTIONS}.`};
	}

	const isValidQuiz = quiz.every(q => {
		if(!(q.quizTitle || typeof q.quizTitle === "string" ||
			q.answers || Array.isArray(q.answers) || 
			q.answers.length === 4)) {
			
			return false;
		}
		
		const isValidAnswers = q.answers.every(a => {
			return typeof a === "string" && a.length < 200;
		});

		return isValidAnswers;
	});

	if(!isValidQuiz){
		return {success: false, msg: "The quiz format is incorrect."};
	}

	return {success: true, msg: "Quiz validation succeeded."};
}


module.exports = {valQuiz};
