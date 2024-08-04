require("dotenv").config();
const {createStore} = require("./src/store/createStore");
const store = createStore();
const {createApi} = require("./src/createApi");
const api = createApi({store});
const http = require("http");
const server = http.createServer();
const port = process.env.PORT || 3000;

server.on("request", api);



server.listen(port, ()=> {
	console.log(`Server is running on port: ${port}`);
});
