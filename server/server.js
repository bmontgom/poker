const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    origins: '*:*',
    transports: ['websocket']
});
const path = require('path');
const uuid = require('uuid');

const state = {
    users: {},
    workItems: [],
    currentItem: null,
    chat: [],
    disconnectedUsers: {}
};

app.use(express.static(path.resolve(__dirname + '/../dist/poker/')));

io.on('connection', (socket) => {
    let userID = uuid.v4();
    const socketID = socket.conn.id;
    socket.emit('confirm', uuid.v4());
    slog('connected');

    socket.on('reconnection', user => {
        slog('user reconnected', user.id);
        userID = user.id;
        state.users[socketID] = state.disconnectedUsers[userID];
        delete state.disconnectedUsers[userID];
        socket.broadcast.emit('user reconnect', userID);
    });

    socket.on('disconnect', () => {
        slog('disconnected');
        state.disconnectedUsers[userID] = state.users[socketID];
        delete state.users[socketID];
        socket.broadcast.emit('user disconnect', userID);
    });

    socket.on('user sign in', user => {
        slog('user signed in: ', user);
        state.users[socketID] = user;
        socket.emit('init', state);
        socket.broadcast.emit('user sign in', state);
    });

    socket.on('user vote', vote => {
        slog('user voted', userID, vote);
        state.users[socketID].vote = vote;
        state.users[socketID].voteHistory.push(vote);
        socket.broadcast.emit('user vote', state);
    });

    socket.on('switch work items', data => {
        slog('work items switching', userID, data);
        //save to state
        //broadcast the switch
    });

    socket.on('add work item', data => {
        slog('work item added', userID, data);
        //save to state
        //broadcast the addition
    });

    socket.on('chat', message => {
        slog('user chat', userID, message)
        //save to state
        //broadcast the message
        socket.broadcast.emit('chat', message);
    });

    function slog() {
        console.log(socket.id, ...arguments);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../dist/poker/index.html'));
});

http.listen(3000, () => {
    console.log('listening on: ', 3000);
});
