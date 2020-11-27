import { Player } from '/Player.js';
import { Ground } from '/Ground.js';
import {Shelter }from '/Shelter.js';

/**
 * Escena que cumple la función de sala de espera mientras se conectan los jugadores para la
 * modalidad multijugador
 */
export class ServerCreator extends Phaser.Scene {
    constructor() {
        super({ key: 'ServerCreator' });
    }

    init(name){
        this.PNAME = name;
    }

    preload() {
        this.load.image('bg', '/resources/game/BackGround/bg.png');
        this.load.image('speaker', '/resources/game/speak.png');
        this.load.spritesheet('Eli', '/resources/game/Entities/helper.png', {
            frameWidth: 80,
            frameHeight: 150
        });

        this.plataforms = new Ground(this);

        this.shelter = new Shelter(this);

        this.player = new Player(this);

        this.playerList = [];

        this.socket = io();
    }

    create() {
        this.socket.emit('setName',this.PNAME);
        this.time.delayedCall(500, () => {
            this.socket.emit("tellME");
        }, [], this);
        this.socket.on("actualPlayers", (data) => {
            this.setList(data);
        });
        //imagen de fondo y camara
        var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        //imagen de fondo y camara

        //Creando plataformas
        this.plataforms.create();
        this.plataforms.create();
        for (let i = 0; i < 7; i++) {
            this.plataforms.addPlataform(500 * i, bg.displayHeight - 32, 'S');
        }
        

        this.shelter.create();
        this.shelter.addShelter(75, bg.displayHeight-185/2-32, 'FOOD');
        this.shelter.addShelter(775, bg.displayHeight-185/2-32, 'WATER');
        this.shelter.addShelter(1075, bg.displayHeight-185/2-32, 'MED');
        this.shelter.addShelter(bg.displayWidth-75, bg.displayHeight-185/2-32, 'FUN');



        this.Eli = this.physics.add.sprite(bg.displayWidth / 4, 593, 'Eli');
        this.Eli.play('eliStay');
        this.speak = this.add.image(bg.displayWidth / 4 - 25, bg.displayHeight - 270, 'speaker');
        this.speak.setScale(0.6);
        this.speak.setOrigin(0.1, 0.1);
        this.speakText = this.add.text(bg.displayWidth / 4 - 30, bg.displayHeight - 230, 'Bienvenido a la sala de espera', {
            fontSize: '20px',
            fill: '#301717',
            fontFamily: 'pixel'
        });

        //Creando Jugador
        this.player.create(this.plataforms.plat, bg);

        //speaker color #301717
        //portales
        this.key = this.physics.add.image(bg.displayWidth*3/4-100,bg.displayHeight-100,'keyBotton');
        this.key.setImmovable();
        this.add.text(bg.displayWidth*3/4-200,bg.displayHeight-210,'Es momento de trabajar\n  ¡A cuidarlos a todos!\n                \\/',{
            fontSize: '25px',
            fill: '#301717',
            fontFamily: 'pixel'
        });
        this.key.body.allowGravity = false;
        var txt = ['Puesto de Comida\nLa comida se usa para llenar\nlos platos para saciar el\nestado HUNGRY',
                   'Puesto de Agua\nEl agua se usa para llenar\nlos platos para saciar el\nestado THIRSTHY',
                   'Puesto de Medicina\nLas medicinas curan\na los gatos del\nestado SICK',
                   'Puesto de Juguetes\nLos juguetes quitan el\nestado BORED'];
        this.add.text(0,bg.displayHeight-350,txt[0],{
            fontSize: '25px',
            fill: '#301717',
            fontFamily: 'pixel'
        });
        this.add.text(700,bg.displayHeight-350,txt[1],{
            fontSize: '25px',
            fill: '#301717',
            fontFamily: 'pixel'
        });
        this.add.text(1000,bg.displayHeight-350,txt[2],{
            fontSize: '25px',
            fill: '#301717',
            fontFamily: 'pixel'
        });
        this.add.text(bg.displayWidth-185,bg.displayHeight-350,txt[3],{
            fontSize: '25px',
            fill: '#301717',
            fontFamily: 'pixel'
        });

        this.physics.add.collider(this.plataforms.plat, this.key);

        this.physics.add.collider(this.plataforms.plat, this.Eli);
        this.physics.add.overlap(this.player.player, this.key, () => {
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

        this.socket.on("newPlayer", (data) => {
            this.speakText.setText('Se ha conectado '+data.name);
            this.addPlayer(data);
        });

        this.socket.on("playerOut", (data) => {
            var i = 0;
            while (this.playerList[i] != data.name) {
                i++;
            }
            delete this.playerList[i];
            this.speakText.setText('Se ha desconectado '+data.name);
        });
    }

    update() {
        this.player.update();
    }

    /**
     * Función que dada la lista de jugadores en el servidor añade sus nombres a las lista de 
     * jugadores
     * @param {*} list
     */
    setList(list) {
        Object.keys(list.players).forEach(id => {
            var player = list.players[id];
            if(player.ID != this.socket.id)
                this.playerList.push(player.name);
        });
    }

    /**
     * Método que añade el nombre de un jugador entrante a la lista de jugadores
     * @param {*} player 
     */
    addPlayer(player) {
        this.playerList.push(player.name);
    }
}
