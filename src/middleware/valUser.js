function valUser({jwt}){
	return (req, res, next) => {
		handleRequest({req, res, next, jwt});
	}
};


async function handleRequest(params){
	const {req, res, next, jwt} = params;
	const token = req.get("Authorization");

	if(!token){
		res.status(400);
		return res.json({success: false, msg: "Please sign in first."});
	}

	try{
		const user = await validateToken(token, jwt);
		if(!user) return res.status(400).json({success: false, msg: "No valid token. Please logout and sign in again."});
		req.user = user;
		next();
	}
	catch(err){
		console.log(err);
		res.status(500);
		res.json({success: false, msg: "Fail to verify token. Please try again."});
	}
}

async function validateToken(token, jwt){
	try{
		const user = await jwt.verify(token, process.env.TOKEN_SECRET);
		return user;
	}
	catch(err){
		throw err;
	}
}


module.exports = {valUser};
