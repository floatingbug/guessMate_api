const {handleServerError} = require("./handleServerError");
const jwt = require("jsonwebtoken");

function signIn({store}){
	return (req, res) => {
		handleRequest({req, res, store});
	}
}


async function handleRequest(params){
	const {req, res, store} = params;

	//check if credentials are provided
	if(!req.body || !req.body.password || !req.body.name){
		return res.status(400).json({success: false, msg: "Some credentials are missed."});
	}

	//validate credentials
	const query = {
		$or: [
			{name: req.body.name},
			{email: req.body.name}
		],
		password: req.body.password
	};
	let user = null;
	try{
		user = await store.getUser(query);
		if(!user){
			res.status(400);
			return res.json({success: false, msg: "Name, email or password incorrect."});
		}
		if(!user.isEmailConfirmed){
			return res.status(400).json({success: false, msg: "Please confirm your email first."});
		}
	}
	catch(err){
		return handleServerError({res, err});
	}

	//create and send token
	let token = null;
	try{
		token = await jwt.sign(user, process.env.TOKEN_SECRET);
	}
	catch(err){
		return handleServerError({res, err});
	}
	
	res.set({
		"Authorization": `Bearer ${token}`
	});
	res.status(200);
	res.json({success: true, msg: "Token sent within the Authorization-Header."});
}


module.exports = {signIn};
