const {handleServerError} = require("./handleServerError");

function getAllAnswers({store}){
	return (req, res) => {
		handleRequest({req, res, store});
	}
}

async function handleRequest(params){
	const {req, res, store} = params;

	try{
		const answers = await store.getAllAnswers();

		if(answers.length < 1) return res.status(400).json({success: false, msg: "No answers have been added yet."});

		res.status(200).json({success: true, msg: "Answers have been sent.", data: answers});
	}
	catch(err){
		return handleServerError({err, res});
	}
}


module.exports = {getAllAnswers};
