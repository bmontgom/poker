const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const users = [
    {
        id: Date.now(),
        preferredName: 'Abc',
        lastName: 'Bcd'
    },
    {
        id: Date.now() + 1,
        preferredName: 'Cde',
        lastName: 'Def'
    }
];

app.use(express.static(path.resolve(__dirname + '/../dist/poker/')));

io.on('connection', (socket) => {
    console.log('got connection');

    socket.on('system status', (data) => {
        console.log('system status update: ', data);
    });

    socket.on('sign in', (user) => {
        console.log('user signed in: ', user);
        socket.emit('init data', users);
        users.push(user);
        socket.broadcast.emit('sign in', user);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../dist/poker/index.html'));
});

http.listen(3000, () => {
    console.log('listening on: ', 3000);
});
