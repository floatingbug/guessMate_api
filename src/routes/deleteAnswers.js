const {handleServerError} = require("./handleServerError");

function deleteAnswers({store}){
	return (req, res) => {
		handleRequest({req, res, store});
	};
}


async function handleRequest(params){
	const {req, res, store} = params;

	if(!req.body || !req.body.answersId || typeof req.body.answersId !== "string"){
		return res.status(400).json({success: false, msg: "Wrong properties for deleting answers."});
	}

	try{
		const docAnswers = {
			answersId: req.body.answersId,
			quizTakerId: req.user.userId
		};
		const docGuesses= {
			answersId: req.body.answersId,
		};

		const result = await store.deleteAnswers(docAnswers, docGuesses);
		if(!result){
			return res.status(500).json({success: false, msg: "Fail to delete answers. Please try again."});
		}
	}
	catch(err){
		return handleServerError({err, res});
	}

	res.status(200).json({success: true, msg: "Answers has been deleted."});
}


module.exports = {deleteAnswers};
