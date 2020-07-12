const app = require('express')();
const express = require('express');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    wsEngine: 'ws',
    origins: '*:*',
    transports: ['websocket'],
});
const path = require('path');
const uuid = require('uuid');

const state = {
    connectedUsers: {},
    disconnectedUsers: {},
    // workItems: [],
    currentItem: {
        itemNumber: 0,
        areVotesShown: false,
        votesShownBy: null
    },
    // chatHistory: [],
    disconnectedUsers: {},
};

io.on('connection', (socket) => {
    let userID = uuid.v4();
    const socketID = socket.conn.id;
    socket.emit('confirm', { socketID, userID });
    slog('connected', socketID, userID);

    socket.on('reconnection', user => {
        slog('user reconnected', user.id);
        userID = user.id;
        state.connectedUsers[socketID] = state.disconnectedUsers[userID];
        delete state.disconnectedUsers[userID];
        socket.broadcast.emit('user reconnect', { state, userID });
    });

    socket.on('disconnect', () => {
        slog('disconnected');
        state.disconnectedUsers[userID] = state.connectedUsers[socketID];
        delete state.connectedUsers[socketID];
        socket.broadcast.emit('user disconnect', { state, userID });
    });

    socket.on('user sign in', user => {
        slog('user signed in: ', user);
        state.connectedUsers[socketID] = user;
        socket.emit('init', { state });
        socket.broadcast.emit('user sign in', { state, user });
    });

    socket.on('user vote', vote => {
        slog('user voted', userID, vote);
        if (state.connectedUsers[socketID]) {
            state.connectedUsers[socketID].vote = vote;
            state.connectedUsers[socketID].voteHistory.push(vote);
            state.connectedUsers[socketID].voteHistoryDisplay =
                state.connectedUsers[socketID].voteHistory.map(vote => vote.value).join(', ');
            socket.emit('user vote', { state, userID, vote });
            socket.broadcast.emit('user vote', { state, userID, vote });
        }
    });

    socket.on('switch work item', newItem => {
        slog('work item switching', userID, newItem);
        state.currentItem = {
            itemNumber: newItem,
            areVotesShown: false
        };
        state.areVotesShown = false;
        Object.values(state.connectedUsers).forEach(user => {
            if (!!user) {
                user.vote = null;
                user.voteHistory = [];
                user.voteHistoryDisplay = '';
            }
        });
        Object.values(state.disconnectedUsers).forEach(user => {
            if (!!user) {
                user.vote = null;
                user.voteHistory = '';
            }
        })
        socket.emit('switch work item', { state, userID, newItem });
        socket.broadcast.emit('switch work item', { state, userID, newItem });
    });

    socket.on('show votes', () => {
        slog('show votes', userID);
        const user = state.connectedUsers[socketID];
        if (user) {
            state.currentItem.areVotesShown = true;
            state.currentItem.votesShownBy = user;
            socket.emit('show votes', { state, userID });
            socket.broadcast.emit('show votes', { state, userID });
        }
    });

    function slog() {
        console.log(socket.id, ...arguments);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../dist/poker/index.html'));
});

app.use(express.static(path.resolve(__dirname + '/../dist/poker/')));

const port = 8000;

server.listen(port, () => {
    console.log('listening on: ', port);
});
