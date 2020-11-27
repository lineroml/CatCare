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
        this.playerList = data.playerList;

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

        this.player = new Player(this);

        this.plataforms = new Ground(this);

        this.shelter = new Shelter(this);

        this.plates = [new Plate(this, 'FOOD', 0), new Plate(this, 'WATER', 1)];

        this.cats = [new Cat(this, 'Charlotto', 'GREEN')];
        this.catStates = [];

        this.judge = new Judge(this, [5, 0], 100);
    }
    create() {
        this.listeners();
        //imagen de fondo y camara
        var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);

        //Puestos de reabastecimiento
        this.shelter.create();
        this.shelter.addShelter(bg.displayWidth-75, bg.displayHeight-185/2-32, 'FOOD');
        this.shelter.addShelter(75, bg.displayHeight-185/2-32, 'WATER');
        this.shelter.addShelter(75, 418-185/2, 'MED');
        this.shelter.addShelter(bg.displayWidth-75, 418-185/2, 'FUN');

        //Creando plataformas
        this.plataforms.create();
        for (let i = 0; i < 7; i++) {
            this.plataforms.addPlataform(500 * i, bg.displayHeight - 32, 'S');
        }
        this.plataforms.addPlataform(282,486,'SS');
        this.plataforms.addPlataform(870,486,'SS');
        this.plataforms.addPlataform(1151,418,'SS');
        this.plataforms.addPlataform(0,418,'SS')


        //Platos de agua y comida
        this.plates[0].put(bg.displayWidth/2-50, 600);
        this.plates[1].put(bg.displayWidth/2+50, 600);

        this.otherPlayers.init();
        this.player.create(this.plataforms.plat,bg);

        for (let i = 0; i < this.cats.length; i++) {
            var cat = this.cats[i];
            console.log(cat.name);
            cat.create(bg);
        }

        this.judge.create();

        this.cameras.main.startFollow(this.player.player);
        this.goToStart = this.add.image(200, 150, 'goToMenu').setScrollFactor(0, 0).setScale(0.5, 0.5).setInteractive(new Phaser.Geom.Rectangle(200, 150, 375, 290), () => {
            this.scene.stop();
            this.scene.start('main');
        }).setVisible(false);
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
        this.socket.on("plateUpdate", (data)=>{
            this.plates.forEach(plate => {
                if(plate.ID === data.ID){
                    console.log(plate.full,data.full)
                    plate.change(data.full);
                }
            });
            console.log(this.plates)
        });

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

            if (this.cats[0].mindlessCat) {
                var cats = data.cats;
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
            var i = 0;
            while (this.playerList[i] != data.ID) {
                i++;
            }
            delete this.playerList[i];
            this.otherPlayers.delete(data.ID);
            this.socket.emit("updateRequest");
        });

        this.socket.on("STOP", () => {
            console.log("Ya ha terminado");
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
                    fontSize: '25px',
                    fill: '#111',
                    fontFamily: 'pixel',
                    backgroundColor: cat.color
                }).setScrollFactor(0, 0));
                num++;
            }
        }
    }

}