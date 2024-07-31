const {handleServerError} = require("./handleServerError");

function getAllQuizzes({store}){
	return (req, res) => {
		handleRequest({req, res, store});
	}
}


async function handleRequest(params){
	const {req, res, store} = params;
	let quizzes = [];

	try{
		quizzes = await store.getAllQuizzes();
		
		if(!quizzes) return res.status(400).json({success: false, msg: "There ara no quizzes yet."});
	}
	catch(err){
		return handleServerError({err, res});
	}

	res.status(200).json({success: true, msg: "Quizzes have been sent.", data: quizzes});
}


module.exports = {getAllQuizzes};
