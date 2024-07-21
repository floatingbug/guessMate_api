function handleServerError(params){
	const {err, res} = params;

	console.log(err);
	res.status(500);
	res.json({success: false, msg: "Something went wrong. Please try again."});
}


module.exports = {handleServerError};
