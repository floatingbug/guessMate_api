const {handleServerError} = require("./handleServerError");

function getQuizzes({store}){
	return (req, res) => {
		handleRequest({req, res, store});
	}
}


async function handleRequest(params){
	const {req, res, store} = params;

	const isValidBody = req.body &&
		req.body.quizIds &&
		Array.isArray(req.body.quizIds) &&
		req.body.quizIds.every(q => typeof q === "string");

	if(!isValidBody){
		return res.status(400).json({success: false, msg: "Invalid properties."});
	}
	
	try{
		const query = {
			$or: req.body.quizIds.map(q => ({quizId: q}))
		};

		const quizzes = await store.getQuizzes(query);
		
		if(quizzes.length < 1) return res.status(400).json({success: false, msg: "No quizzes found."});
		
		res.status(200).json({success: false, msg: "Quizzes have been sent", data: quizzes});
	}
	catch(err){
		return handleServerError({err, res});
	}
}


module.exports = {getQuizzes};
