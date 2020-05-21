let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {
    console.log('got request');
    res.send('<h1>Yo</h1>');
});

http.listen(3000, () => {
    console.log('listening on: ', 3000);
});
