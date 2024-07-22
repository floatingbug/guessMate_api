const express = require("express");
const bodyParser = require("body-parser");
const {signIn} = require("./routes/signIn");
const {addUser} = require("./routes/addUser");
const {addQuiz} = require("./routes/addQuiz");
const {addAnswers} = require("./routes/addAnswers");
const {addGuess} = require("./routes/addGuess");
const {valUser} = require("./middleware/valUser");
const {valQuiz} = require("./middleware/valQuiz");
const {valAnswers} = require("./middleware/valAnswers");
const {valGuess}  = require("./middleware/valGuess");
const {deleteQuiz} = require("./routes/deleteQuiz");
const {deleteAnswers} = require("./routes/deleteAnswers");
const {deleteGuesses} = require("./routes/deleteGuesses");
const {getGuesses} = require("./routes/getGuesses");
const {getAnswers} = require("./routes/getAnswers");
const {getQuizzes} = require("./routes/getQuizzes");
const {getUserData} = require("./routes/getUserData");
const jwt = require("jsonwebtoken");

function createApi({store}){
	const api = express();

	api.use(bodyParser.json());

	api.post("/sign-in", signIn({store}));
	api.post("/add-quiz", valUser({jwt}), valQuiz(), addQuiz({store}));
	api.post("/add-answers", valUser({jwt}), valAnswers(), addAnswers({store}));
	api.post("/add-guess", valUser({jwt}), valGuess(), addGuess({store}));
	api.post("/add-user", addUser({store}));
	api.get("/add-user", addUser({store}));
	api.delete("/delete-quiz", valUser({jwt}),  deleteQuiz({store}));
	api.delete("/delete-answers", valUser({jwt}), deleteAnswers({store}));
	api.delete("/delete-guesses", valUser({jwt}), deleteGuesses({store}));
	api.post("/get-guesses", getGuesses({store}));
	api.post("/get-answers", getAnswers({store}));
	api.post("/get-quizzes", getQuizzes({store}));
	api.get("/get-user-data", valUser({jwt}), getUserData({store}));

	return api;
}


module.exports = {createApi};
