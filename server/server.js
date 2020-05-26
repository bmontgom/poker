const app = require('express')();
const express = require('express');
const server = require('http').createServer(app);

const path = require('path');
const uuid = require('uuid');

const state = {
    connectedUsers: {},
    disconnectedUsers: {},
    workItems: [],
    currentItem: null,
    // chatHistory: [],
    disconnectedUsers: {}
};

app.use(express.static(path.resolve(__dirname + '/../dist/poker/')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../dist/poker/index.html'));
});

server.listen(3000, () => {
    console.log('listening on: ', 3000);
});
