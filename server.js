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
this.cats = {};
var numPlayers = 0;

io.on("connection", (socket) => {
  numPlayers++;
  if (numPlayers > 28) {
    socket.emit("disconnect");
  }
  var socketid = socket.id;
  if (numPlayers == 1) this.primeControler = socket.id;

  socket.emit("actualPlayers", {players: this.players});
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

  socket.on("setName", name =>{
    this.players[socket.id].name = name;
    socket.broadcast.emit("newPlayer", this.players[socketid]);
  })

  socket.on("newCat", (data) => {
    if (data.password == this.primeControler) {
      this.cats[data.name] = {
        name: data.name,
        type: data.type,
        state: data.state,
        x: data.x,
        y: data.y
      };
      socket.broadcast.emit("mindlessCat");
    }
  });
  socket.on("tellME", ()=>{
    socket.emit("actualPlayers", {players: this.players});
  })

  socket.on("catUpdate", (data) => {
    var cat = this.cats[data.name];
    cat.x = data.x;
    cat.y = data.y;
    cat.state = data.state;
  });

  socket.on("catPos", (data) => {
    if (data.password == this.primeControler) {
      var cat = this.cats[data.name];
      cat.x = data.x;
      cat.y = data.y;
    }
  });

  socket.on("playerApproachCat", (data) => {
    socket.emit("catScape", data);
    socket.broadcast.emit("catScape", data);
  });

  socket.on("UpdatePlayer", data => {
    var player = this.players[data.ID];
    player.x = data.x;
    player.y = data.y;
    player.tool = data.tool;
  });

  socket.on("updatePoints", (data) => {
    var player = this.players[data.ID];
    player.points = data.score;
  });

  socket.on("plateCreated", (data) => {
    if (data.password == this.primeControler) {
      this.plates[data.ID] = {
        ID: data.ID,
        type: data.type,
        full: false
      }
    }
  });

  socket.on("plateStateC", (data) => {
    Object.keys(this.plates).forEach(id => {
      
      var infoPlate = this.plates[id];
      if (infoPlate.ID == data.ID) {
        console.log(data);
        infoPlate.full = data.full;
      }
    });
    socket.broadcast.emit("plateUpdate", data);
  });

  socket.on("newGameS", (data) => {
    if (data.password == this.primeControler) {
      var send = {
        select: data.select,
        players: this.players,

      }
      socket.broadcast.emit("startGame", send);
      socket.emit("startGame", send);
    }
  });

  socket.on("updateRequest", () => {
    socket.emit("update", { players: this.players, cats: this.cats});
  });

  socket.on("ItEnded", () => {
    socket.emit("STOP");
    socket.broadcast.emit("STOP");
  });
  socket.on("disconnect", () => {
    numPlayers--;
    console.log("user disconnected", socket.id);
    if (socket.id == this.primeControler) {
      var temp = this.primeControler;
      Object.keys(this.players).forEach(id => {
        if (id != this.primeControler & temp == this.primeControler) {
          this.primeControler = id;
        }
      });
    }
    socket.broadcast.emit("playerOut", { ID: socket.id, name: this.players[socket.id].name});
    delete this.players[socket.id];
  });
});