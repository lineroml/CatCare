var express = require("express");
var path = require("path");
var app = express();

//settings
app.set("port", process.env.PORT || 3000);

//static files: archivos que se envian una sola vez al navegador
console.log(path.join(__dirname, "src"));
app.use(express.static(path.join(__dirname, "src")));
//Iniciar el servidor
var server = app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});

//Websockets

var SocketIO = require("socket.io");
let io = SocketIO(server);
var players = {};

io.on("connection", (socket) => {
  console.log("Alguien se ha conectado", socket.id);
  players[socket.id] = {
    ID: socket.id,
    name: "",
    x: 100,
    y: 500,
    points: 0,
    skin: 'player', 
    tool: undefined
  };
  // update all other players of the new player
  socket.broadcast.emit("newPlayer", players[socket.id]);

  socket.on("newGameS",(data)=>{
    var send = {
      select: data.select,
      players: players,
    
    }
    socket.broadcast.emit("startGame",send);
    socket.emit("startGame",send);
  });

  socket.on("disconnect", function () {
    console.log("user disconnected");
    // remove this player from our players object
    delete players[socket.id];
  });
});