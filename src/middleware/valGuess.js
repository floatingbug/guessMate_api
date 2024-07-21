function valGuess(){
	return (req, res, next) => {
		handleRequest({req, res, next});
	}
}


async function handleRequest(params){
	const {req, res, next} = params;

	if(typeof req.body.answersId !== "string" || 
		!Array.isArray(req.body.guesses)
	){
		return res.status(400).json({success: false, msg: "Wrong types."});
	}

	const isNumbersOnly = req.body.guesses.every(g => typeof g === "number");

	if(!isNumbersOnly){
		return res.status(400).json({success: false, msg: "Every element in guesses must be type number."});
	}

	next();
}


module.exports = {valGuess};
