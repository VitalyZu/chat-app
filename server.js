const Express = require('express');
const Socket = require('socket.io');
const _ = require('lodash');

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded());
const httpServer = require("http").createServer(app);
const io = Socket(httpServer, {cors: {origin: "*"}});

const data = new Map();

//
if (!Object.fromEntries) {
	Object.fromEntries = function (entries){
		if (!entries || !entries[Symbol.iterator]) { throw new Error('Object.fromEntries() requires a single iterable argument'); }
		let obj = {};
		for (let [key, value] of entries) {
			obj[key] = value;
		}
		return obj;
	};
}
//

app.get('/data/:id', function(request, response){
    let id = request.params.id;
    let list;
    if(data.has(id)){
        list = {
            users: _.values(data.get(id).users),
            messages:  _.values(data.get(id).messages)
        }
        response.json(list);
    }
    response.json({users:[], messages: []});
});

app.post('/auth', function(request, response){
    const id = request.body.roomid;
    if(!data.has(id)) {
        data.set(id, {
            users: {},
            messages: []
        }
        );
    }
    response.json( Object.fromEntries(data.entries()) );
});

io.on('connection', function(socket){
    socket.on('join', function(r){
        socket.join(r.id);
        data.get(r.id).users[socket.id] = r.username;
        socket.to(r.id).emit('joined', _.values(data.get(r.id).users));
    });
    socket.on('send', function(r){
        data.get(r.id).messages.push({text: r.text, user: r.user, time: r.time});
        socket.to(r.id).emit('send_msg', data.get(r.id).messages);
    });
    socket.on('disconnect', function(){
        data.forEach(function(roomData, roomId){
            if(_.has(roomData.users, socket.id)) {
                delete roomData.users[socket.id];
                socket.to(roomId).emit('leave', _.values(data.get(roomId).users));
            }         
        });
    });
});

httpServer.listen(8888, function(error){
    if(error) throw new Error(error);
    console.log('Server started');
});