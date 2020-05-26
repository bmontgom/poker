const io = require('socket.io')(server, {
  wsEngine: 'ws',
  origins: '*:*',
  transports: ['websocket'],
});

io.on('connection', (socket) => {
    let userID = uuid.v4();
    const socketID = socket.conn.id;
    socket.emit('confirm', userID);
    slog('connected');

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
        socket.broadcast.emit('user disconnect', {state, userID});
    });

    socket.on('user sign in', user => {
        slog('user signed in: ', user);
        state.connectedUsers[socketID] = user;
        socket.emit('init', {state});
        socket.broadcast.emit('user sign in', { state, user });
    });

    socket.on('user vote', vote => {
        slog('user voted', userID, vote);
        state.connectedUsers[socketID].vote = vote;
        state.connectedUsers[socketID].voteHistory.push(vote);
        socket.emit('user vote', { state, userID, vote });
        socket.broadcast.emit('user vote', { state, userID, vote });
    });

    // socket.on('switch work items', data => {
    //     slog('work items switching', userID, data);
    //     //save to state
    //     //broadcast the switch
    // });

    // socket.on('add work item', data => {
    //     slog('work item added', userID, data);
    //     //save to state
    //     //broadcast the addition
    // });

    // socket.on('user chat', message => {
    //     slog('user chat', userID, message)
    //     state.chatHistory.push({
    //         userID,
    //         timestamp: Date.now(),
    //         message
    //     });
    //     socket.broadcast.emit('user chat', {
    //         state: state,
    //         userID: userID,
    //         message: message
    //     });
    // });

    function slog() {
        console.log(socket.id, ...arguments);
    }
});
