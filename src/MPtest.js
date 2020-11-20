import { Ground } from "/Ground.js";
import { Player } from "/Player.js";
import { OtherP } from "/OtherP.js"
import { Shelter } from "/Shelter.js";
import { Plate } from "/Plate.js";

export class MPtest extends Phaser.Scene {
    constructor() {
        super({ key: "MPtest" });
    }

    init(data) {
        this.socket = data.socket;
        this.infoOthers = {};
        this.otherPlayers = new OtherP(this);

        var players = data.players;
        Object.keys(players).forEach(id => {
            var infoPlayer = players[id];
            if (infoPlayer.ID != this.socket.id) {
                this.infoOthers[infoPlayer.ID] = infoPlayer;
            }
        });

        this.otherPlayers.updateInfo(this.infoOthers);

        this.timer = this.time.addEvent({
            delay: 10,
            callback: () => {
                this.socket.emit("updateRequest");
            },
            callbackScope: this,
            loop: true
        });
    }

    preload() {

        this.load.image('bg', '/resources/game/BackGround/bg.png');

        this.player = new Player(this);

        this.plataforms = new Ground(this);

        this.shelter = new Shelter(this);

        this.plates = [new Plate(this, 'FOOD', 0), new Plate(this, 'WATER', 1)];

    }
    create() {
        this.listeners();
        //imagen de fondo y camara
        var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);

        this.shelter.create();
        this.shelter.addShelter(200, 715, 'FOOD');
        this.shelter.addShelter(600, 715, 'WATER');
        this.shelter.addShelter(1000, 715, 'MED');
        this.shelter.addShelter(1400, 715, 'FUN');

        this.plataforms.create();
        for (let i = 0; i < 7; i++) {
            this.plataforms.addPlataform(540 * i, bg.displayHeight - 100, 'B')
        }

        this.plates[0].put(750, 500);
        this.plates[1].put(850, 500);

        this.otherPlayers.init()
        this.player.create(this.plataforms.plat);

        this.cameras.main.startFollow(this.player.player);
    }

    update() {
        this.player.update();
        this.socket.emit("UpdatePlayer", {
            ID: this.socket.id,
            x: this.player.getX(),
            y: this.player.getY(),
            tool: this.player.getTool()
        });
    }

    listeners() {
        this.socket.on("update", data => {
            var players = data.players;
            Object.keys(players).forEach(id => {
                var infoPlayer = players[id];
                if (infoPlayer.ID != this.socket.id) {
                    this.infoOthers[infoPlayer.ID] = infoPlayer;
                }
            });
            this.otherPlayers.updateInfo(this.infoOthers);
            this.otherPlayers.update();

            var plates = data.plates;
            Object.keys(plates).forEach(id => {
                var plateInfo = plates[id];
                for (let i = 0; i < this.plates.length; i++) {
                    var plate = this.plates[i];
                    if (plate.ID == plateInfo.ID && plate.full != plateInfo.full) {
                        plate.full = plateInfo.full;
                        if (plate.full = true) {
                            var t = (plate.type == 'FOOD') ? 'fPlate' : 'wPlate';
                            plate.plate.setTexture(t);
                        } else {
                            plate.plate.setTexture('plate');
                        }
                    }
                }
            });

        });

        this.socket.on("playerOut", (data) => {
            this.otherPlayers.delete(data.ID);
            this.socket.emit("updateRequest");
        })
    }


}