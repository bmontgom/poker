let app = require('express')();
let express = require('express');
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let path = require('path');

app.use(express.static(path.resolve(__dirname + '/../dist/poker/')));

app.get('/', (req, res) => {
    console.log('got request');
    res.sendFile(path.resolve(__dirname + '/../dist/poker/index.html'));
});

http.listen(3000, () => {
    console.log('listening on: ', 3000);
});
