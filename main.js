require("dotenv").config();
const {createStore} = require("./src/store/createStore");
const store = createStore();
const {createApi} = require("./src/createApi");
const api = createApi({store});
const http = require("http");
const server = http.createServer();

server.on("request", api);


server.listen(process.env.PORT);
