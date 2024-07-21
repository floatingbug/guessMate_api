const {handleServerError} = require("./handleServerError");

function getGuesses({store}){
	return (req, res) => {
		handleRequest({req, res, store});
	};
}


async function handleRequest(params){
	const {req, res, store} = params;

	const isValidBody = req.body && 
		req.body.guessIds &&
		Array.isArray(req.body.guessIds) &&
		req.body.guessIds.every(g => typeof g === "string");


	if(!isValidBody){
		return res.status(400).json({success: false, msg: "Invalid properties."});
	}

	try{
		const query = {
			$or: req.body.guessIds.map(g => ({guessId: g}))
		};

		const guesses = await store.getGuesses(query);
	
		if(guesses.length < 1) return res.status(400).json({success: false, msg: "No guesses have been found."});
		
		res.status(200).json({success: true, msg: "Guesses have been sent.", data: guesses});
	}
	catch(err){
		return handleServerError({err, res});
	}
}


module.exports = {getGuesses};
