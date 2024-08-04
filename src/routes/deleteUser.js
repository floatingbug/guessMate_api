const {handleServerError} = require("./handleServerError");

function deleteUser({store}){
	return (req, res) => {
		handleRequest({req, res, store});
	}
}


async function handleRequest(params){
	const {req, res, store} = params;
	const usersDoc = {
		userId: req.user.userId
	};
	const quizzesDoc = {
		creatorId: req.user.userId
	};
	const guessesDoc = {
		guesserId: req.user.userId
	};
	const answersDoc = {
		quizTakerId: req.user.userId
	};

	try{
		const result = await store.deleteUser({quizzesDoc, guessesDoc, answersDoc, usersDoc});
		
		if(!result) return res.status(400).json({success: false, msg: "Fail to delete user. Please try again or contact me."});
	}
	catch(err){
		return handleServerError({err, res});
	}

	res.status(200).json({success: true, msg: "User has been removed."});
}


module.exports = {deleteUser};
