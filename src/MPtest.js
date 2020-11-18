import { Ground } from "/Ground.js";
import { Player } from "/Player.js";
import { OtherP } from "/OtherP.js"

export class MPtest extends Phaser.Scene {
    constructor() {
        super({ key: "MPtest" });
    }

    init(data) {
        this.here = data.socket;
        this.infoOthers = {};
        this.otherPlayers = new OtherP(this);

        var players = data.players;
        Object.keys(players).forEach(id => {
            var infoPlayer = players[id];
            if (infoPlayer.ID != this.here.id) {
                this.infoOthers[infoPlayer.ID] = infoPlayer;
            }
        });
        this.otherPlayers.updateInfo(this.infoOthers);
        console.log(this.otherPlayers);
    }

    preload() {
        this.load.image('bg', '/resources/game/BackGround/bg.png');

        this.player = new Player(this);

        this.plataforms = new Ground(this);

    }
    create() {
        this.listeners();

        //imagen de fondo y camara
        var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight)
        //imagen de fondo y camara

        this.plataforms.create();
        for (let i = 0; i < 7; i++) {
            this.plataforms.addPlataform(540 * i, bg.displayHeight - 100, 'B')
        }
        this.otherPlayers.init()
        this.player.create(this.plataforms.plat);

        //Enfocando camara al jugador
        this.cameras.main.startFollow(this.player.player);
        //Enfocando camara al jugador
    }

    update() {
        this.player.update();
    }

    listeners() {
        this.here.on("update", () => {
            this.otherPlayers.update();
        });
    }
}