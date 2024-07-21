const {handleServerError} = require("./handleServerError");
const {sendMail} = require("../services/sendMail");
const {randomUUID} = require("crypto");
const validator = require("validator");

function addUser({store}){
	return (req, res) => {
		handleRequest({req, res, store});
	}
};

async function handleRequest(params){
	const {req, res, store} = params;

	//if confirmation number as query exists, confirm email
	if(req.query.confNumber){
		try{
			const filter = {
				confirmationNumber: req.query.confNumber
			};
			await store.confirmEmail(filter);
		}
		catch(err){
			return handleServerError({res, err});
		}

		return res.redirect(process.env.API_URL);
	}
	
	//validate credentials
	const validationResult = validateCredentials(req.body);
	if(!validationResult.success){
		res.status(400);
		return res.json(validationResult);
	}
	
	//check if name or email exists already
	try{
		const query = {
			$or: [
				{name: req.body.name},
				{email: req.body.email}
			]
		}
		const user = await store.getUser(query);

		if(user) return res.json({success: false, msg: "Name or email already exists."});
	}
	catch(err){
		return handleServerError({res, err});
	}
	
	//add user to db
	const confirmationNumber = randomUUID();
	try{
		const doc = {
			userId: randomUUID(),
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			isEmailConfirmed: false,
			confirmationNumber
		};
		await store.addUser(doc);
	}
	catch(err){
		return handleServerError({err, res});
	}

	//send confirmation e-mail
	const confirmLink = `${process.env.API_URL}/add-user?confNumber=${confirmationNumber}`;
	try{
		const result = await sendMail({email: req.body.email, confirmLink});
	}
	catch(err){
		console.log(err)
		return handleServerError({res, err});
	}

	//send success
	res.status(200);
	res.json({success: true, msg: "User has been added"});
}

function validateCredentials(credentials){
	if(!credentials || !credentials.email || !credentials.name || !credentials.password){
		return {success: false, msg: "Some credentials are missed."};
	}

	if(!validator.isEmail(credentials.email)){
		return {success: false, msg: "An valid email address is required."};
	}

	return {success: true};
}


module.exports = {addUser};
