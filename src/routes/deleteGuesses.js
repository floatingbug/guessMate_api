const {handleServerError} = require("./handleServerError");

function deleteGuesses({store}){
	return (req, res) => {
		handleRequest({req, res, store});
	}
}


async function handleRequest(params){
	const {req, res, store} = params;

	if(!req.body || !req.body.guessId || typeof req.body.guessId !== "string"){
		return res.status(400).json({success: false, msg: "Invalid properties."});
	}

	try{
		const doc = {
			guessId: req.body.guessId,
			guesserId: req.user.userId
		};

		const result = await store.deleteGuesses(doc);
		if(!result){
			return res.status(400).json({success: false, msg: "Not owner of guesses or not signed in or guessId is wrong."});
		}
	}
	catch(err){
		return handleServerError({err, res});
	}

	res.status(200).json({success: true, msg: "Guesses have been deleted."});
};


module.exports = {deleteGuesses};
