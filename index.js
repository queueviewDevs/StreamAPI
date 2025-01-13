const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const _ = require('lodash');
const {WebSocketServer} = require('ws');
const {connection} = require('./connection');
const {routers} = require('./router');

//NGINX running on 8081
const PORT = 8080;
const app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.server = http.createServer(app);

//Setup WebSocket server
app.wss = new WebSocketServer({server: app.server});
app.connections = new connection(app);
app.routers = routers(app);

app.server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});