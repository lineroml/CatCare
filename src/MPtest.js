import { Ground } from "/Ground.js";
import { Player } from "/Player.js";
import { OtherP } from "/OtherP.js"
import { Shelter } from "/Shelter.js";
import { Plate } from "/Plate.js";
import { Cat } from "/Cat.js";
import { Judge } from "./Judge.js";

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
        this.load.image('zoneRed', '/resources/game/Entities/Cats/zoneRed.png');
        this.load.image('zoneYellow', '/resources/game/Entities/Cats/zoneYellow.png');
        this.load.image('pauseMenu', '/resources/game/menu.png');

        this.player = new Player(this);

        this.plataforms = new Ground(this);

        this.shelter = new Shelter(this);

        this.plates = [new Plate(this, 'FOOD', 0), new Plate(this, 'WATER', 1)];

        this.cats = [new Cat(this, 'green', 'GREEN')];
        this.catStates = [];

        this.judge = new Judge(this,[5,0],100);
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

        this.otherPlayers.init();
        this.player.create(this.plataforms.plat);

        for (let i = 0; i < this.cats.length; i++) {
            var cat = this.cats[i];
            cat.create(bg);
        }

        this.judge.create();

        this.cameras.main.startFollow(this.player.player);
        this.menu = this.add.image(400,300,'pauseMenu').setScrollFactor(0,0).setVisible(false);
    }

    update() {
        this.player.update();
        this.socket.emit("UpdatePlayer", {
            ID: this.socket.id,
            x: this.player.getX(),
            y: this.player.getY(),
            tool: this.player.getTool()
        });
        this.catUpdate();
        this.judge.update();
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
            if (this.cats[0].mindlessCat) {
                var cats = data.cats;
                console.log("Me updateo")
                for (let i = 0; i < this.cats.length; i++) {
                    var cat = this.cats[i];
                    var infoCat = cats[cat.name];
                    cat.setXY(infoCat.x, infoCat.y);
                    cat.state = infoCat.state;
                }
            }
        });
        if (!this.cats[0].mindlessCat) {
            this.socket.on("catScape", (data) => {
                var cat = this.catByName(data.name);
                cat.approach({ x: data.zoneX }, { x: data.playerX });
            });

        }
        this.socket.on("playerOut", (data) => {
            this.otherPlayers.delete(data.ID);
            this.socket.emit("updateRequest");
        });

        this.socket.on("STOP",()=>{
            console.log("Ya ha terminado");
            this.menu.setVisible(true);
            this.scene.sleep();
        })
    }

    catByName(name) {
        for (let i = 0; i < this.cats.length; i++) {
            var cat = this.cats[i];
            if (cat.name = name) {
                return cat;
            }
        }
        return null;
    }
catUpdate() {
        for (let i = 0; i < this.catStates.length; i++) {
            var cat = this.catStates[i];
            cat.destroy();
        }
        this.catState = [];
        var num = 0;
        for (let i = 0; i < this.cats.length; i++) {
            var cat = this.cats[i];
            cat.update();
            if (cat.state != 'NORMAL') {
                this.catStates.push(this.add.text(100, 50 + 50 * num, cat.name + ': ' + cat.state, {
                    fontSize: '20px',
                    fill: '#111',
                    fontFamily: 'verdana, arial, sans-serif'
                }).setScrollFactor(0, 0));
                num++;
            }
        }
    }

}