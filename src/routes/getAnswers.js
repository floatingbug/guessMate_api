const {handleServerError} = require("./handleServerError");

function getAnswers({store}){
	return (req, res) => {
		handleRequest({req, res, store});
	}
}


async function handleRequest(params){
	const {req, res, store} = params;

	const isValidBody = req.body &&
		req.body.answersIds &&
		Array.isArray(req.body.answersIds) &&
		req.body.answersIds.every(a => typeof a === "string");

	if(!isValidBody){
		return res.status(400).json({success: false, msg: "Invalid properties."});
	}

	try{
		const query = {
			$or: req.body.answersIds.map(a => ({answersId: a}))
		};

		const answers = await store.getAnswers(query);
		
		if(answers.length < 1) return res.status(400).json({success: false, msg: "No answers found."});

		res.status(200).json({success: true, msg: "Answers have been sent.", data: answers});
	}
	catch(err){
		return handleServerError({err, res});
	}
}


module.exports = {getAnswers};
