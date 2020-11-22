import { Player } from '/Player.js';
import { Ground } from '/Ground.js';
export class ServerCreator extends Phaser.Scene {
    constructor() {
        super({ key: 'ServerCreator' });
    }

    preload() {
        this.load.image('bg', '/resources/game/BackGround/bg.png');

        this.plataforms = new Ground(this);

        this.player = new Player(this);

        this.playerList = [];

        this.socket = io();

    }

    create() {
        //imagen de fondo y camara
        var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight)
        //imagen de fondo y camara

        //Creando plataformas
        this.plataforms.create();
        for (let i = 0; i < 7; i++) {
            this.plataforms.addPlataform(540 * i, bg.displayHeight - 100, 'B')
        }
        //Creando plataformas



        //Creando Jugador
        this.player.create(this.plataforms.plat);


        //portales
        this.secondWorld = this.physics.add.image(100, 705, 'multiP').setScale(0.5);
        this.physics.add.collider(this.plataforms.plat, this.secondWorld);

        this.physics.add.overlap(this.player.player, this.secondWorld, () => {
            var selectedWorld = "MPtest";
            this.socket.emit("newGameS", { select: selectedWorld, password: this.socket.id });
        }, () => { return this.player.eKey.isDown; }, this);
        //portales


        //Enfocando camara al jugador
        this.cameras.main.startFollow(this.player.player);
        //Enfocando camara al jugador

        this.socket.on("startGame", (data) => {
            var send = {
                players: data.players,
                socket: this.socket,
                playerList: this.playerList
            }
            this.scene.stop();
            this.scene.start(data.select, send);
        });

        this.socket.on("actualPlayers", (data) => {
            this.setList(data);
        });

        this.socket.on("newPlayer", (data) => {
            this.addPlayer(data);
        });

        this.socket.on("playerOut", (data) => {
            var i = 0;
            while (this.playerList[i] != data.ID) {
                i++;
            }
            delete this.playerList[i];
        });
    }

    update() {
        this.player.update();
    }

    setList(list) {
        Object.keys(list).forEach(id => {
            this.playerList.push(list[id].ID);
        });
    }

    addPlayer(player) {
        this.playerList.push(player.ID);
    }
}
