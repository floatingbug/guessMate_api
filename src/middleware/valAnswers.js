function valAnswers(){
	return (req, res, next) => {
		handleRequest({req, res, next});
	};
}


async function handleRequest(params){
	const {req, res, next} = params;

	if(!req.body || !req.body.quizId || !req.body.answers){
		return res.status(400).json({success: false, msg: "Some properties are missed."});
	}

	if(typeof req.body.quizId !== "string" || !Array.isArray(req.body.answers) ||
		req.body.answers.length > 24){
		return res.status(400).json({success: false, msg: "Wron Type."});
	}

	//check if all elements are type of number
	const isTypeNumber = req.body.answers.every(a => typeof a === "number");
	if(!isTypeNumber){
		return res.status(400).json({success: false, msg: "Every element type in answers must be number."});
	}

	next();
}


module.exports = {valAnswers};
