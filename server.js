const { ENGINE_METHOD_DIGESTS } = require("constants");
var express = require("express");
var path = require("path");
var app = express();


app.set("port", process.env.PORT || 3000);


app.use(express.static(path.join(__dirname, "src")));

var server = app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});

var SocketIO = require("socket.io");
let io = SocketIO(server);

this.players = {};
this.plates = {};
var numPlayers = 0;

io.on("connection", (socket) => {
  numPlayers++;
  var socketid = socket.id;
  if (numPlayers == 1) this.primeControler = socket.id;
  console.log("Alguien se ha conectado", socketid);
  this.players[socketid] = {
    ID: socketid,
    name: "",
    x: 100,
    y: 500,
    points: 0,
    skin: 'player',
    tool: undefined
  };

  socket.broadcast.emit("newPlayer", this.players[socketid]);

  socket.on("newGameS", (data) => {
    var send = {
      select: data.select,
      players: this.players,

    }
    socket.broadcast.emit("startGame", send);
    socket.emit("startGame", send);
  });

  socket.on("UpdatePlayer", data => {
    var player = this.players[data.ID];
    player.x = data.x;
    player.y = data.y;
    player.tool = data.tool;
  });


  socket.on("plateCreated", (data) => {
    if (data.password == this.primeControler) {
      this.plates[data.ID] = {
        ID: data.ID,
        x: data.x,
        y: data.y,
        type: data.type,
        full: false
      }
    }
  });

  socket.on("platePut", (data) => {
    if (data.password == this.primeControler) {
      Object.keys(this.plates).forEach(id => {
        var infoPlate = this.plates[id];
        if (infoPlate.ID == data.ID) {
          infoPlate.x = data.x;
          infoPlate.y = data.y;
        }
      });
    }
  });

  socket.on("plateStateC", (data) => {
    Object.keys(this.plates).forEach(id => {
      var infoPlate = this.plates[id];
      if (infoPlate.ID == data.ID) {
        infoPlate.full = data.full;
      }
    });
  });

  socket.on("updateRequest", () => {
    socket.emit("update", { players: this.players, plates: this.plates });
  });

  socket.on("disconnect", () => {
    numPlayers--;
    console.log("user disconnected", socket.id);
    delete this.players[socket.id];
    socket.broadcast.emit("playerOut", { ID: socket.id });
  });
});