const nodemailer = require("nodemailer");

async function sendMail(params){
	const {email, confirmLink} = params;

	const transporter = nodemailer.createTransport({
	  host: "smtp.gmail.com",
	  port: 587,
	  auth: {
		user: process.env.GMAIL_EMAIL,
		pass: process.env.GMAIL_PASSWORD
	  },
	});

	try{
		const info = await transporter.sendMail({
			from: `"guessMate" <${process.env.GMAIL_EMAIL}>`,
			to: email,
			subject: "Email confirmation (guessMate)", // Subject line
			html: `Please click on <a href="${confirmLink}">this link</a> to confirm your email address.`, // html body
		});
	}
	catch(err){
		throw err;
	}
}


module.exports = {sendMail};
