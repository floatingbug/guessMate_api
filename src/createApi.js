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
const {deleteUser} = require("./routes/deleteUser");
const {getGuesses} = require("./routes/getGuesses");
const {getAnswers} = require("./routes/getAnswers");
const {getQuizzes} = require("./routes/getQuizzes");
const {getAllQuizzes} = require("./routes/getAllQuizzes");
const {getAllAnswers} = require("./routes/getAllAnswers");
const {getUserData} = require("./routes/getUserData");
const jwt = require("jsonwebtoken");
const cors = require("cors");

function createApi({store}){
	const api = express();
	const corsOptions = {
		exposedHeaders: ["Authorization"]
	};

	api.use(cors(corsOptions));
	api.use(bodyParser.json());

	api.post("/guessmateapi/sign-in", signIn({store}));
	api.post("/guessmateapi/add-quiz", valUser({jwt}), valQuiz(), addQuiz({store}));
	api.post("/guessmateapi/add-answers", valUser({jwt}), valAnswers(), addAnswers({store}));
	api.post("/guessmateapi/add-guess", valUser({jwt}), valGuess(), addGuess({store}));
	api.post("/guessmateapi/add-user", addUser({store}));
	api.get("/guessmateapi/add-user", addUser({store}));
	api.delete("/guessmateapi/delete-quiz", valUser({jwt}),  deleteQuiz({store}));
	api.delete("/guessmateapi/delete-answers", valUser({jwt}), deleteAnswers({store}));
	api.delete("/guessmateapi/delete-guesses", valUser({jwt}), deleteGuesses({store}));
	api.delete("/guessmateapi/delete-user", valUser({jwt}), deleteUser({store}));
	api.post("/guessmateapi/get-guesses", getGuesses({store}));
	api.post("/guessmateapi/get-answers", getAnswers({store}));
	api.post("/guessmateapi/get-quizzes", getQuizzes({store}));
	api.get("/guessmateapi/get-all-quizzes", valUser({jwt}), getAllQuizzes({store}));
	api.get("/guessmateapi/get-all-answers", valUser({jwt}), getAllAnswers({store}));
	api.get("/guessmateapi/get-user-data", valUser({jwt}), getUserData({store}));

	return api;
}


module.exports = {createApi};
